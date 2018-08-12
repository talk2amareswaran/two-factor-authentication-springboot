$(document).ready(function(){
	getUsersList();
	
	$("#updateOperation").click(function() {
		doUpdate();
	});
	

	$("#deleteOperation").click(function() {
		doDelete();
	});
	

	$("#addOperation").click(function() {
		doAdd();
	});
	
	
	
});

function getUsersList() {
	$.ajax({
		  type: "GET",
		  url: "http://localhost:8000/users",
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
			  },
		  success: function(msg){
			  
			  if(msg.length>0) {
				  $("tbody").empty();
			    $.each(msg, function (index, value) {
			    	
			    	value.first_name = (value.first_name==undefined ? "&nbsp;" : value.first_name);
			    	value.last_name = (value.last_name==undefined ? "&nbsp;" : value.last_name);
			    	value.email_id = (value.email_id==undefined ? "&nbsp;" : value.email_id);
			    	value.mobile = (value.mobile==undefined ? "&nbsp;" : value.mobile);
			    	value.country = (value.country==undefined ? "&nbsp;" : value.country);
			    	value.user_type = (value.user_type==undefined ? "&nbsp;" : value.user_type);
			    	
			        $("tbody").append(" <tr><td>"+value.first_name+"</td><td>"+value.last_name+"</td><td>"+value.email_id+"</td><td>"+value.mobile+"</td><td>"+value.country+"</td><td>"+value.user_type+"</td>" +
			        		" <td class=\"text_align_center\"><button class=\"customBtn\" " +
			        		" data-first_name="+value.first_name+" "+ 
			        		" data-last_name="+value.last_name+" "+
			        		" data-mobile="+value.mobile+" "+
			        		" data-country="+value.country+" "+
			        		" data-id="+value.id+" "+
			        		"id=edit_user_"+value.id+" "+
			        		"title=\"Edit\" onclick=\"editOperationModel(this.id)\"><i class=\"fa fa-edit\"></i></button>&nbsp;&nbsp;&nbsp;&nbsp;" +
			        		"<button class=\"closeBtn\" title=\"Delete\" onclick=\"deleteOperationModel("+value.id+")\"><i class=\"fa fa-remove\"></i></button></td></tr>");
			    });
			    
			  } else {
				  $("tbody").append(" <tr><td  colspan=\"7\">No records to display</td></tr>");
			  }
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown) {
			  if(XMLHttpRequest.responseText.indexOf("Access token expired:")!=-1) {
				  getNewToken("users.html");
			  } else if(XMLHttpRequest.status==403) {
				  	$("table").remove();
					$(".alert-danger").show();
					$(".alert-success").hide();
					$("#addNewBtn").hide();
			   } else {
				 localStorage.clear();
				 window.location.href="index.html";
			   }
		  }
		});
}

function editOperationModel(idName) {
	$("#editModal").modal('show');
	$("#edit_first_name").val($("#"+idName).attr("data-first_name"));
	$("#edit_last_name").val($("#"+idName).attr("data-last_name"));
	$("#edit_mobile").val($("#"+idName).attr("data-mobile"));
	$("#edit_country").val($("#"+idName).attr("data-country"));
	$("#edit_id").val($("#"+idName).attr("data-id"));
	
	
}

function doAdd() {
	
	var user_type = "admin";
	if($("#customCheck").prop("checked"))
		user_type = "super_admin";
	
	$.ajax({
		  type: "POST",
		  url: "http://localhost:8000/users",
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
			    request.setRequestHeader("Content-Type", "application/json");
			  },
			  data: JSON.stringify({ 
					"first_name": $("#first_name").val(),
					"last_name":$("#last_name").val(),
					"mobile": $("#mobile").val(),
					"country": $("#country").val(),
					"email_id": $("#email_address").val(),
					"password": $("#pwd").val(),
					"user_type": user_type
				 }),
		  success: function(msg){
			  $("#myModal").modal('hide');
			  $(".alert-success").show();
			  $(".alert-danger").hide();
			  $(".alert-success").html('<strong>User added successfully</strong>');
			  getUsersList();
			  
			  
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown) {
			  if(XMLHttpRequest.responseText.indexOf("Access token expired:")!=-1) {
				  getNewTokenOnOperation(function() {
					  doAdd();
				  });
			  } else if(XMLHttpRequest.status==403) {
				  $("#myModal").modal('hide');
				  $(".alert-danger").html('<strong>You don\'t have the permission to do add a new user</strong>');
				  $(".alert-danger").show();
				  $(".alert-success").hide();
			   } else {
				 localStorage.clear();
				 window.location.href="index.html";
			   }
		  }
		});
}

function doDelete() {
	
	$.ajax({
		  type: "DELETE",
		  url: "http://localhost:8000/users/"+$("#delete_id").val(),
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
			  },
		  success: function(msg){
			  $(".alert-success").show();
			  $(".alert-danger").hide();
			  $(".alert-success").html('<strong>User deleted successfully</strong>');
			  $("#deleteModel").modal('hide');
			  getUsersList();
			  
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown) {
			  if(XMLHttpRequest.responseText.indexOf("Access token expired:")!=-1) {
				  getNewTokenOnOperation(function() {
					  doDelete();
				  });
			  } else if(XMLHttpRequest.status==403) {
				  $("#deleteModel").modal('hide');
				  $(".alert-danger").html('<strong>You don\'t have the permission to do delete operation</strong>');
				  $(".alert-danger").show();
					$(".alert-success").hide();
			   } 
			  else if(XMLHttpRequest.status==500) {
				  $(".alert-danger").html('<strong>Users are assigned to the role. You can\'t delete.</strong>');
				  $(".alert-danger").show();
				  $(".alert-success").hide();
				  $("#deleteModel").modal('hide');
			   } else {
				 localStorage.clear();
				 window.location.href="index.html";
			   }
		  }
		});
}

function doUpdate() {
	$.ajax({
		  type: "PUT",
		  url: "http://localhost:8000/users/"+$("#edit_id").val(),
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
			    request.setRequestHeader("Content-Type", "application/json");
			  },
			  data: JSON.stringify({ 
					"first_name": $("#edit_first_name").val(),
					"last_name":$("#edit_last_name").val(),
					"mobile": $("#edit_mobile").val(),
					"country": $("#edit_country").val()
				 }),
		  success: function(msg){
			  $("#editModal").modal('hide');
			  $(".alert-success").show();
			  $(".alert-danger").hide();
			  $(".alert-success").html('<strong>User updated successfully</strong>');
			  getUsersList();
			  
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown) {
			  if(XMLHttpRequest.responseText.indexOf("Access token expired:")!=-1) {
				  getNewTokenOnOperation(function() {
					  doUpdate();
				  });
			  } else if(XMLHttpRequest.status==403) {
				  $("#editModal").modal('hide');
				  $(".alert-danger").html('<strong>You don\'t have the permission to do edit/update operation</strong>');
				  $(".alert-danger").show();
				  $(".alert-success").hide();
			   } else {
				 localStorage.clear();
				 window.location.href="index.html";
			   }
		  }
		});
	
}


function deleteOperationModel(id) {
	$("#delete_id").val(id);
	$("#deleteModel").modal('show');	
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