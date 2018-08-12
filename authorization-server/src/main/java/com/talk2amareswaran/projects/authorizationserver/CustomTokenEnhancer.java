package com.talk2amareswaran.projects.authorizationserver;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;

public class CustomTokenEnhancer extends JwtAccessTokenConverter {

	@Override
	public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {
		CustomUser user = (CustomUser) authentication.getPrincipal();
		Map<String, Object> info = new LinkedHashMap<>(accessToken.getAdditionalInformation());
		if (user.getId() != null)
			info.put("id", user.getId());
		if (user.getFirst_name() != null)
			info.put("first_name", user.getFirst_name());
		if (user.getLast_name() != null)
			info.put("last_name", user.getLast_name());
		if (user.getCountry() != null)
			info.put("country", user.getCountry());
		if (user.getMobile() != null)
			info.put("mobile", user.getMobile());
		if (user.getUser_type() != null)
			info.put("user_type", user.getUser_type());
		if (user.getIs_tfa_enabled() != null)
			info.put("is_2fa_enabled", user.getIs_tfa_enabled());
		if (user.getTfa_default_type() != null)
			info.put("tfa_default_type", user.getTfa_default_type());
		if (user.getUsername() != null)
			info.put("email_id", user.getUsername());
		DefaultOAuth2AccessToken customAccessToken = new DefaultOAuth2AccessToken(accessToken);
		customAccessToken.setAdditionalInformation(info);
		return super.enhance(customAccessToken, authentication);
	}	
}