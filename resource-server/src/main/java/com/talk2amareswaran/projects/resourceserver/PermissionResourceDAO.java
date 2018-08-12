package com.talk2amareswaran.projects.resourceserver;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class PermissionResourceDAO {

	@Autowired
	JdbcTemplate jdbcTemplate;

	public List<Permission> getListOfPermissions() {
		Collection<Map<String, Object>> rows3 = jdbcTemplate.queryForList("select * from permission");
		List<Permission> permissionsList = new ArrayList<>();
		rows3.stream().map((row) -> {
			Permission p = new Permission();
			p.setPermission_name((String)row.get("permission_name"));
			p.setId(String.valueOf(row.get("id")));
			return p;
		}).forEach((ss3) -> {
			permissionsList.add(ss3);
		});
		return permissionsList;
	}
}