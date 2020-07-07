package com.empathy.app.controller;

import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.empathy.api.dto.board.BacklogIssue;
import com.empathy.api.dto.board.IssueTeamMember;
import com.empathy.api.dto.board.IssueTeamMemberBacklog;

@RestController
@RequestMapping("/board")
public class BoardController {

	@Autowired
	private Environment env;

	Logger logger = LoggerFactory.getLogger(BoardController.class);

	@GetMapping(path = "/backlog/{projectID}/{sprintID}", produces = "application/json")
	public List<BacklogIssue> getBacklog(@PathVariable String projectID, @PathVariable String sprintID) {
		RestTemplate restTemplate = new RestTemplate();

		String uri = env.getProperty("empathy.api.base.url") + env.getProperty("empathy.api.board.sprint.backlog.get")
				.replace("{projectID}", projectID).replace("{sprintID}", sprintID);
		
		logger.debug("empathy.api.board.sprint.backlog.get: {}", uri);

		// get sprint backlog
		ResponseEntity<BacklogIssue[]> backlogIssueResponse = restTemplate.getForEntity(uri, BacklogIssue[].class);
		BacklogIssue[] backlogIssueArray = backlogIssueResponse.getBody();

		// get for each issue team members
		for (BacklogIssue bi : backlogIssueArray) {
			uri = env.getProperty("empathy.api.base.url")
					+ env.getProperty("empathy.api.board.issue.team.get").replace("{issueID}", bi.getIssueID());

			ResponseEntity<IssueTeamMember[]> issueTeamMemberResponse = restTemplate.getForEntity(uri,
					IssueTeamMember[].class);
			IssueTeamMember[] issueTeamMemberList = issueTeamMemberResponse.getBody();
			// get for each team member backlog
			for (IssueTeamMember itm : issueTeamMemberList) {
				uri = env.getProperty("empathy.api.base.url")
						+ env.getProperty("empathy.api.board.issue.team.member.backlog.get")
								.replace("{memberID}", itm.getUserID()).replace("{parentID}", bi.getIssueID());
				logger.debug("empathy.api.board.issue.team.member.backlog.get: {}", uri);
				ResponseEntity<IssueTeamMemberBacklog[]> issueTeamMemberBacklogResponse = restTemplate.getForEntity(uri,
						IssueTeamMemberBacklog[].class);
				IssueTeamMemberBacklog[] issueTeamMemberBacklogList = issueTeamMemberBacklogResponse.getBody();
				// add backlog to team member metadata
				itm.getMetadaData().put("backlog", issueTeamMemberBacklogList);
			}
			// add team to issue
			bi.getMetadaData().put("team", issueTeamMemberList);

		}

		List<BacklogIssue> backlogIssueList = Arrays.asList(backlogIssueArray);
		return backlogIssueList;
	}

}