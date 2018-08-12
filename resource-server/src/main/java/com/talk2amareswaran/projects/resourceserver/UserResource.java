package com.talk2amareswaran.projects.resourceserver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserResource {

	@Autowired
	UserResourceDAO userResourceDAO;

	@PreAuthorize("hasAnyRole('view_users', 'SUPERADMIN')")
	@RequestMapping(value = "/users", method = RequestMethod.GET)
	public ResponseEntity<Object> getListOfUsers() {
		return new ResponseEntity<>(userResourceDAO.getListOfUsers(), HttpStatus.OK);
	}

	@PreAuthorize("hasAnyRole('delete_users', 'SUPERADMIN')")
	@RequestMapping(value = "/users/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Object> deleteUser(@PathVariable("id") String user_id) {
		
		
		AccessTokenMapper accessTokenMapper = (AccessTokenMapper) 
				((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
		
		
		if(accessTokenMapper.getUser_type().equalsIgnoreCase("admin") && userResourceDAO.isSuperAdmin(user_id)) {
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		}
		
		userResourceDAO.deleteUser(user_id);
		return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
	}

	@PreAuthorize("hasAnyRole('edit_users', 'SUPERADMIN')")
	@RequestMapping(value = "/users/{id}", method = RequestMethod.PUT)
	public ResponseEntity<Object> updateUser(@PathVariable("id") String user_id, @RequestBody UserModel userModel) {
		AccessTokenMapper accessTokenMapper = (AccessTokenMapper) 
				((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
		
		
		if(accessTokenMapper.getUser_type().equalsIgnoreCase("admin") && userResourceDAO.isSuperAdmin(user_id)) {
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		}
		userResourceDAO.updateUser(user_id, userModel);
		return new ResponseEntity<>("User updated successfully", HttpStatus.OK);
	}

	@PreAuthorize("hasAnyRole('create_users', 'SUPERADMIN')")
	@RequestMapping(value = "/users", method = RequestMethod.POST)
	public ResponseEntity<Object> createUser(@RequestBody UserModel userModel) {
		AccessTokenMapper accessTokenMapper = (AccessTokenMapper) 
				((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
		
		
		if(accessTokenMapper.getUser_type().equalsIgnoreCase("admin") && userModel.getUser_type().equalsIgnoreCase("super_admin")) {
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		}
		userResourceDAO.createUser(userModel);
		return new ResponseEntity<>("User created successfully", HttpStatus.OK);
	}
}
