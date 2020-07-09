package com.empathy.app.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.empathy.api.dto.sso.user.User;

@RestController
@RequestMapping("/user")
public class UserController {

	@Autowired
	private Environment env;

	Logger logger = LoggerFactory.getLogger(UserController.class);

	@GetMapping(path = "/{userID}", produces = "application/json")
	public User getUser(@PathVariable String userID) {

		RestTemplate restTemplate = new RestTemplate();
		String uri = env.getProperty("empathy.api.base.url")
				+ env.getProperty("empathy.api.user.get").replace("{userID}", userID);

		User user = restTemplate.getForObject(uri, User.class);

		return user;
	}

}
