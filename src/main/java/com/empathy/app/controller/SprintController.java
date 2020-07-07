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

import com.empathy.api.dto.board.SprintSummary;
import com.empathy.api.dto.sprint.IssueMemberDaily;

@RestController
@RequestMapping("/sprint")
public class SprintController {

	@Autowired
	private Environment env;

	Logger logger = LoggerFactory.getLogger(SprintController.class);

	@GetMapping(path = "/u/{ownerID}/project/{projectID}", produces = "application/json")
	public List<SprintSummary> findByProjectId(@PathVariable String ownerID, @PathVariable String projectID) {

		RestTemplate restTemplate = new RestTemplate();
		String uri = env.getProperty("empathy.api.base.url") + env.getProperty("empathy.api.sprint.find.by.project.id")
				.replace("{ownerID}", ownerID).replace("{projectID}", projectID);

		ResponseEntity<SprintSummary[]> sprintResponse = restTemplate.getForEntity(uri, SprintSummary[].class);
		SprintSummary[] sprintArray = sprintResponse.getBody();

		List<SprintSummary> sprintList = Arrays.asList(sprintArray);

		return sprintList;
	}
	
	@PostMapping(path = "/u/daily", produces = "application/json")
	public void saveDaily(@Valid @RequestBody IssueMemberDaily issueMemberDaily) {
		RestTemplate restTemplate = new RestTemplate();
		String uri = env.getProperty("empathy.api.base.url") + env.getProperty("empathy.api.sprint.member.daily.post");
		restTemplate.postForEntity(uri, issueMemberDaily, IssueMemberDaily.class);
		
	}

}
