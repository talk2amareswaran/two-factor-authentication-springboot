$(document).ready(function(){
	getRolesList();	
	
	$(".nav-link").click(function() {
		$(".alert-danger").hide();
		$(".alert-success").hide();
		getRolesList();
		$("#assign_users_role_select").hide();
		$("#assign_permissions_role_select").hide();
		$("#assign_permissions_btn").hide();
		$("#assign_users_btn").hide();
		$("#view_users_role_table").hide();
		$("#view_permissions_role_table").hide();
		
	});
	
	$("#view_permissions_role").change(function() {
		showPermissionsTable($("#view_permissions_role option:selected").val());
	});
	
	
	$("#view_users_role").change(function() {
		showUsersTable($("#view_users_role option:selected").val());
	});
	
	$("#assign_permissions_role").change(function() {
		showPermissionsSelect($("#assign_permissions_role option:selected").val());
	});
	
	$("#assign_permissions_btn").click(function() {
		assignPermissions($("#assign_permissions_role option:selected").val());
	});
	
	$("#assign_users_role").click(function() {
		showUsersSelect($("#assign_users_role option:selected").val());
	});
	
	$("#assign_users_btn").click(function() {
		assignUsers($("#assign_users_role option:selected").val());
	});
	
	
});

function assignUsers(val) {

	var selectedList = [];
    $.each($("#assign_users_role_select option:selected"), function(){            
    	selectedList.push($(this).val());
    });
    
    
	$.ajax({
		  type: "PUT",
		  url: "http://localhost:8000/roles/"+val+"/users",
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
			    request.setRequestHeader("Content-Type", "application/json");
			  },
			  data: JSON.stringify(selectedList),
		  success: function(msg){
			  $(".alert-success").show();
			  $(".alert-success").html("<strong>Users are assigned to the role successfully. It will be effective from the users next login</strong>");
			  $(".alert-danger").hide();
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown) {
			  if(XMLHttpRequest.responseText.indexOf("Access token expired:")!=-1) {
				  getNewTokenOnOperation(function() {
					  assignUsers(val);
				  });
			  } else if(XMLHttpRequest.status==403) {
				  $(".alert-danger").html('<strong>You don\'t have the permission to assign the users to this role</strong>');
				  $(".alert-danger").show();
				  $(".alert-success").hide();
			   } else {
				 localStorage.clear();
				 window.location.href="index.html";
			   }
		  }
		});

}

function assignPermissions(val) {
	var selectedList = [];
    $.each($("#assign_permissions_role_select option:selected"), function(){            
    	selectedList.push($(this).val());
    });
    
    
	$.ajax({
		  type: "PUT",
		  url: "http://localhost:8000/roles/"+val+"/permissions",
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
			    request.setRequestHeader("Content-Type", "application/json");
			  },
			  data: JSON.stringify(selectedList),
		  success: function(msg){
			  $(".alert-success").show();
			  $(".alert-success").html("<strong>Permissions are assigned to the role successfully. It will be effective from the users next login</strong>");
			  $(".alert-danger").hide();
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown) {
			  if(XMLHttpRequest.responseText.indexOf("Access token expired:")!=-1) {
				  getNewTokenOnOperation(function() {
					  assignPermissions(val);
				  });
			  } else if(XMLHttpRequest.status==403) {
				  $(".alert-danger").html('<strong>You don\'t have the permission to assign the list of permissions to this role</strong>');
				  $(".alert-danger").show();
				  $(".alert-success").hide();
			   } else {
				 localStorage.clear();
				 window.location.href="index.html";
			   }
		  }
		});
	
    
}


function showUsersSelect(val) {
	
	if(val=="") {
		  $("#assign_users_role_select").hide();
		  $("#assign_users_role_select").empty();
		  $("#assign_users_btn").hide();  
	} else {
		$.ajax({
			  type: "GET",
			  url: "http://localhost:8000/users",
			  beforeSend: function(request) {
				    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
				  },
			  success: function(msg){
				  $("#assign_users_role_select").show();
				  $("#assign_users_role_select").empty();
				  if(msg.length>0) {
					  $("#assign_users_btn").show();  
				    $.each(msg, function (index, value) {
				    		if(value.user_type!="super_admin")
				    			$("#assign_users_role_select").append("<option value="+value.id+">"+value.email_id+"</option>");
				    });
				  } 
			  },
			  error: function(XMLHttpRequest, textStatus, errorThrown) {
				  if(XMLHttpRequest.responseText.indexOf("Access token expired:")!=-1) {
					  getNewTokenOnOperation(function() {
						  showUsersSelect(val);
					  });
				  } else if(XMLHttpRequest.status==403) {
					  $(".alert-danger").show();
					  $(".alert-success").hide();
					  $("#assign_users_role_select").hide();
					  $("#assign_users_role_select").empty();
					  $("#assign_users_btn").hide();  
						 $(".alert-danger").html("<strong>You don't have permission to view the list of users</strong>");
				   } else {
					 localStorage.clear();
					 window.location.href="index.html";
				   }
			  }
			});
	}
}


function showPermissionsSelect(val) {
	
	if(val=="") {
		  $("#assign_permissions_role_select").hide();
		  $("#assign_permissions_role_select").empty();
		  $("#assign_permissions_btn").hide();  
	} else {
	$.ajax({
		  type: "GET",
		  url: "http://localhost:8000/permissions",
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
			  },
		  success: function(msg){
			  $("#assign_permissions_role_select").show();
			  $("#assign_permissions_role_select").empty();
			  if(msg.length>0) {
				  $("#assign_permissions_btn").show();  
			    $.each(msg, function (index, value) {
			        $("#assign_permissions_role_select").append("<option value="+value.id+">"+value.permission_name+"</option>");
			    });
			  } 
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown) {
			  if(XMLHttpRequest.responseText.indexOf("Access token expired:")!=-1) {
				  getNewTokenOnOperation(function() {
					  showPermissionsSelect(val);
				  });
			  } else if(XMLHttpRequest.status==403) {
				  $(".alert-danger").show();
				  $(".alert-success").hide();
				  $("#assign_permissions_role_select").hide();
				  $("#assign_permissions_role_select").empty();
				  $("#assign_permissions_btn").hide();
					 $(".alert-danger").html("<strong>You don't have permission to view the list of permissions</strong>");
			   } else {
				 localStorage.clear();
				 window.location.href="index.html";
			   }
		  }
		});
	}
	
}


function showUsersTable(val) {
	if(val=="") {
		$("#view_users_role_table").hide();
		$("#view_users_role_table tbody").empty();
		$(".alert-danger").hide();
	} else {
		
		$.ajax({
			  type: "GET",
			  url: "http://localhost:8000/roles/"+val+"/users",
			  beforeSend: function(request) {
				    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
				  },
			  success: function(msg){
				  if(msg.length>0) {
						$("#view_users_role_table tbody").empty();
						$("#view_users_role_table").show();
				    $.each(msg, function (index, value) {
				        $("#view_users_role_table tbody").append(" <tr><td>"+(index+1)+"</td><td>"+value.email_id+"</td></tr>");
				    });
				  } else {
					  $("#view_users_role_table tbody").empty();
						$("#view_users_role_table").show();
					  $("#view_users_role_table tbody").append(" <tr><td  colspan=\"2\">No records to display</td></tr>");
				  }
			  },
			  error: function(XMLHttpRequest, textStatus, errorThrown) {
				  if(XMLHttpRequest.responseText.indexOf("Access token expired:")!=-1) {
					  getNewTokenOnOperation(function() {
						  showUsersTable(val);
					  });
				  } else if(XMLHttpRequest.status==403) {
					 $(".alert-danger").show();
					 $(".alert-success").hide();
					 $(".alert-danger").html("<strong>You don't have permission to view the list of users by role</strong>");
				   } else {
					 localStorage.clear();
					 window.location.href="index.html";
				   }
			  }
			});
		
	}
}

function showPermissionsTable(val) {
	if(val=="") {
		$("#view_permissions_role_table").hide();
		$("#view_permissions_role_table tbody").empty();
		$(".alert-danger").hide();
	} else {
		
		$.ajax({
			  type: "GET",
			  url: "http://localhost:8000/roles/"+val+"/permissions",
			  beforeSend: function(request) {
				    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
				  },
			  success: function(msg){
				  if(msg.length>0) {
						$("#view_permissions_role_table tbody").empty();
						$("#view_permissions_role_table").show();
				    $.each(msg, function (index, value) {
				        $("#view_permissions_role_table tbody").append(" <tr><td>"+(index+1)+"</td><td>"+value+"</td></tr>");
				    });
				  } else {
					  $("#view_permissions_role_table tbody").empty();
						$("#view_permissions_role_table").show();
					  $("#view_permissions_role_table tbody").append(" <tr><td  colspan=\"2\">No records to display</td></tr>");
				  }
			  },
			  error: function(XMLHttpRequest, textStatus, errorThrown) {
				  if(XMLHttpRequest.responseText.indexOf("Access token expired:")!=-1) {
					  getNewTokenOnOperation(function() {
						  showPermissionsTable(val);
					  });
				  } else if(XMLHttpRequest.status==403) {
					 $(".alert-danger").show();
					 $(".alert-success").hide();
					 $(".alert-danger").html("<strong>You don't have permission to view the list of permissions by role</strong>");
				   } else {
					 localStorage.clear();
					 window.location.href="index.html";
				   }
			  }
			});
		
	}
}


function getRolesList() {
	$.ajax({
		  type: "GET",
		  url: "http://localhost:8000/roles",
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
			  },
		  success: function(msg){
			  
			 if(msg.length>0) {
				  $("#view_permissions_role").empty();
				  $("#view_users_role").empty();
				  $("#assign_permissions_role").empty();
				  $("#assign_users_role").empty();

				  $("#view_permissions_role").append("<option value=''>---Select Role---</option>");
				  $("#view_users_role").append("<option value=''>---Select Role---</option>");
				  $("#assign_permissions_role").append("<option value=''>---Select Role---</option>");
				  $("#assign_users_role").append("<option value=''>---Select Role---</option>");
				  
			    $.each(msg, function (index, value) {
			    	$("#view_permissions_role").append("<option value='"+value.id+"'>"+value.role_name+"</option>");
			    	$("#view_users_role").append("<option value='"+value.id+"'>"+value.role_name+"</option>");
			    	$("#assign_permissions_role").append("<option value='"+value.id+"'>"+value.role_name+"</option>");
			    	$("#assign_users_role").append("<option value='"+value.id+"'>"+value.role_name+"</option>");
			    });
			  } 
			 
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown) {
			  if(XMLHttpRequest.responseText.indexOf("Access token expired:")!=-1) {
				  getNewToken("settings.html");
			  } else if(XMLHttpRequest.status==403) {
				  $(".nav-tabs").empty();
				  $(".alert-danger").show();
				  $(".alert-success").hide();
				  $(".tab-content").empty();
			   } else {
				 localStorage.clear();
				 window.location.href="index.html";
			   }
		  }
		});
}

function getNewTokenOnOperation(callbackMethod) {
	$.ajax({
		  type: "POST",
		  url: "http://localhost:8080/oauth/token",
		  data: "refresh_token="+localStorage.getItem("refresh_token")+"&grant_type=refresh_token",
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Basic "+btoa("talk2amareswaran:talk@amareswaran"));
			    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			  },
		  success: function(msg){
		        localStorage.setItem("access_token", JSON.parse(JSON.stringify(msg)).access_token);
		        localStorage.setItem("refresh_token", JSON.parse(JSON.stringify(msg)).refresh_token);
		        callbackMethod();
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown) {
			  localStorage.clear();
			  window.location.href="index.html";
		  }
		});
}

function getNewToken(pageName) {
	$.ajax({
		  type: "POST",
		  url: "http://localhost:8080/oauth/token",
		  data: "refresh_token="+localStorage.getItem("refresh_token")+"&grant_type=refresh_token",
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Basic "+btoa("talk2amareswaran:talk@amareswaran"));
			    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			  },
		  success: function(msg){
		        localStorage.setItem("access_token", JSON.parse(JSON.stringify(msg)).access_token);
		        localStorage.setItem("refresh_token", JSON.parse(JSON.stringify(msg)).refresh_token);
		        window.location.reload(pageName);
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown) {
			  localStorage.clear();
			  window.location.href="index.html";
		  }
		});
}