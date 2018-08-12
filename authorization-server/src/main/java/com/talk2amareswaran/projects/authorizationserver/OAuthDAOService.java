package com.talk2amareswaran.projects.authorizationserver;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Repository;

@Repository
public class OAuthDAOService {

	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	public UserEntity getUserDetails(String username) {
		Collection<GrantedAuthority> grantedAuthoritiesList = new ArrayList<>();
		String userSQLQuery = "select * from users where email_id=?";
		List<UserEntity> list = jdbcTemplate.query(userSQLQuery, new String[] { username },
				(ResultSet rs, int rowNum) -> {
					UserEntity user = new UserEntity();
					user.setCountry(rs.getString("country"));
					user.setEmail_id(username);
					user.setFirst_name(rs.getString("first_name"));
					user.setId(rs.getString("id"));
					user.setLast_name(rs.getString("last_name"));
					user.setMobile(rs.getString("mobile"));
					user.setUser_type(rs.getString("user_type"));
					user.setPasssword(rs.getString("password"));
					user.setIs_tfa_enabled(rs.getString("is_2fa_enabled"));
					user.setTfa_default_type(rs.getString("2fa_default_type"));
					return user;
				});

		if (!list.isEmpty()) {
			UserEntity userEntity = list.get(0);

			if (userEntity.getUser_type() != null) {
				if (!userEntity.getUser_type().trim().equalsIgnoreCase("super_admin")) {
					String permissionQuery = "select distinct p.permission_name from users u inner join role_users r_u on u.id=r_u.user_id "
							+ "inner join role r on r_u.role_id=r.id "
							+ "inner join role_permission r_p on r_p.role_id=r.id "
							+ "inner join permission p on p.id=r_p.permission_id where u.email_id=?";
					List<String> permissionList = jdbcTemplate.query(permissionQuery.toString(),
							new String[] { username }, (ResultSet rs, int rowNum) -> {
								return "ROLE_" + rs.getString("permission_name");
							});
					if (permissionList != null && !permissionList.isEmpty()) {
						for (String permission : permissionList) {
							GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(permission);
							grantedAuthoritiesList.add(grantedAuthority);
						}
						list.get(0).setGrantedAuthoritiesList(grantedAuthoritiesList);
					}
					return list.get(0);
				} else {
					GrantedAuthority grantedAuthority = new SimpleGrantedAuthority("ROLE_SUPERADMIN");
					grantedAuthoritiesList.add(grantedAuthority);
					list.get(0).setGrantedAuthoritiesList(grantedAuthoritiesList);
					return list.get(0);
				}
			} else {
				return null;
			}
		}
		return null;
	}
	
}
