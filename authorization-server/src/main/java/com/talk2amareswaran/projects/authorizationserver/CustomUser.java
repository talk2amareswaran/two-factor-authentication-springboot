package com.talk2amareswaran.projects.authorizationserver;

import org.springframework.security.core.userdetails.User;

public class CustomUser extends User {

	private static final long serialVersionUID = 1L;
	private String id;
	private String first_name;
	private String last_name;
	private String mobile;
	private String country;
	private String user_type;
	private String is_tfa_enabled;
	private String tfa_default_type;
	
	public CustomUser(UserEntity user) {
		super(user.getEmail_id(), user.getPasssword(), user.getGrantedAuthoritiesList());
		this.id = user.getId();
		this.first_name = user.getFirst_name();
		this.last_name = user.getLast_name();
		this.mobile = user.getMobile();
		this.country = user.getCountry();
		this.user_type = user.getUser_type();
		this.tfa_default_type = user.getTfa_default_type();
		this.is_tfa_enabled = user.getIs_tfa_enabled();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getFirst_name() {
		return first_name;
	}

	public void setFirst_name(String first_name) {
		this.first_name = first_name;
	}

	public String getLast_name() {
		return last_name;
	}

	public void setLast_name(String last_name) {
		this.last_name = last_name;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getUser_type() {
		return user_type;
	}

	public void setUser_type(String user_type) {
		this.user_type = user_type;
	}

	public String getIs_tfa_enabled() {
		return is_tfa_enabled;
	}

	public void setIs_tfa_enabled(String is_tfa_enabled) {
		this.is_tfa_enabled = is_tfa_enabled;
	}

	public String getTfa_default_type() {
		return tfa_default_type;
	}

	public void setTfa_default_type(String tfa_default_type) {
		this.tfa_default_type = tfa_default_type;
	}
	
	
	
	
}
