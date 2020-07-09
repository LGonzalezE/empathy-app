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

import com.empathy.api.dto.project.TeamMemberProject;

@RestController
@RequestMapping("/project")
public class ProjectController {

	@Autowired
	private Environment env;

	Logger logger = LoggerFactory.getLogger(ProjectController.class);

	@GetMapping(path = "/team/member/{memberID}/project/find", produces = "application/json")
	public List<TeamMemberProject> getBacklog(@PathVariable String memberID) {

		RestTemplate restTemplate = new RestTemplate();
		String uri = env.getProperty("empathy.api.base.url")
				+ env.getProperty("empathy.api.team.member.project.find").replace("{memberID}", memberID);

		ResponseEntity<TeamMemberProject[]> teamMemberProjectResponse = restTemplate.getForEntity(uri,
				TeamMemberProject[].class);
		TeamMemberProject[] teamMemberProjectArray = teamMemberProjectResponse.getBody();

		List<TeamMemberProject> teamMemberProjectList = Arrays.asList(teamMemberProjectArray);

		return teamMemberProjectList;
	}

}
