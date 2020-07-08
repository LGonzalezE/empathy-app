package com.empathy.app.controller;

import java.util.Arrays;
import java.util.List;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.empathy.api.dto.sprint.IssueMemberDaily;
import com.empathy.api.dto.sprint.Sprint;
import com.empathy.api.dto.sprint.TeamMemberSprintIssue;

@RestController
@RequestMapping("/sprint")
public class SprintController {

	@Autowired
	private Environment env;

	Logger logger = LoggerFactory.getLogger(SprintController.class);

	@GetMapping(path = "/u/{ownerID}/project/{projectID}", produces = "application/json")
	public List<Sprint> findByProjectId(@PathVariable String ownerID, @PathVariable String projectID) {

		RestTemplate restTemplate = new RestTemplate();
		String uri = env.getProperty("empathy.api.base.url") + env.getProperty("empathy.api.sprint.find.by.project.id")
				.replace("{ownerID}", ownerID).replace("{projectID}", projectID);

		ResponseEntity<Sprint[]> sprintResponse = restTemplate.getForEntity(uri, Sprint[].class);
		Sprint[] sprintArray = sprintResponse.getBody();

		List<Sprint> sprintList = Arrays.asList(sprintArray);

		return sprintList;
	}
	
	@PostMapping(path = "/u/daily", produces = "application/json")
	public void saveDaily(@Valid @RequestBody IssueMemberDaily issueMemberDaily) {
		RestTemplate restTemplate = new RestTemplate();
		String uri = env.getProperty("empathy.api.base.url") + env.getProperty("empathy.api.sprint.member.daily.post");
		logger.debug("empathy.api.sprint.member.daily.post: {}",uri);
		restTemplate.postForEntity(uri, issueMemberDaily, IssueMemberDaily.class);
		
	}
	
	@GetMapping(path = "/{sprintID}/team/member/u/{memberID}/parent/{parentID}/backlog/{issueLevel}", produces = "application/json")
	public List<TeamMemberSprintIssue> findTeamMemberSprintBacklog(@PathVariable String sprintID, @PathVariable String memberID, @PathVariable String parentID,@PathVariable Integer issueLevel) {

		RestTemplate restTemplate = new RestTemplate();
		// uri : /team/member/sprint/u/{memberID}/{sprintID}/{parentID}/{issueLevel}
		String uri = env.getProperty("empathy.api.base.url") + env.getProperty("empathy.api.board.sprint.issue.team.member.backlog.get")
				.replace("{sprintID}", sprintID).replace("{memberID}", memberID).replace("{parentID}", parentID).replace("{issueLevel}", String.valueOf(issueLevel));

		ResponseEntity<TeamMemberSprintIssue[]> sprintResponse = restTemplate.getForEntity(uri, TeamMemberSprintIssue[].class);
		TeamMemberSprintIssue[] sprintArray = sprintResponse.getBody();

		List<TeamMemberSprintIssue> sprintList = Arrays.asList(sprintArray);

		return sprintList;
	}
	

}
