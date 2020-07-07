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

import com.empathy.api.dto.project.Project;

@RestController
@RequestMapping("/project")
public class ProjectController {

	@Autowired
	private Environment env;

	Logger logger = LoggerFactory.getLogger(ProjectController.class);

	@GetMapping(path = "/u/{ownerID}/find", produces = "application/json")
	public List<Project> getBacklog(@PathVariable String ownerID) {

		RestTemplate restTemplate = new RestTemplate();
		String uri = env.getProperty("empathy.api.base.url")
				+ env.getProperty("empathy.api.owner.project.find").replace("{ownerID}", ownerID);

		ResponseEntity<Project[]> projectResponse = restTemplate.getForEntity(uri, Project[].class);
		Project[] projectArray = projectResponse.getBody();
		
		List<Project> projectList = Arrays.asList(projectArray);

		return projectList;
	}

}
