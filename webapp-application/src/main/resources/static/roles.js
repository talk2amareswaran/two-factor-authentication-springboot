$(document).ready(function(){
	getRolesList();
	
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

function getRolesList() {
	$.ajax({
		  type: "GET",
		  url: "http://localhost:8000/roles",
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
			  },
		  success: function(msg){
			  
			  if(msg.length>0) {
				  $("tbody").empty();
			    $.each(msg, function (index, value) {
			    	
			        $("tbody").append(" <tr><td>"+(index+1)+"</td><td>"+value.role_name+"</td>" +
			        		" <td class=\"text_align_center\"><button class=\"customBtn\" title=\"Edit\" onclick=\"editOperationModel("+value.id+",'"+value.role_name+"')\"><i class=\"fa fa-edit\"></i></button>&nbsp;&nbsp;&nbsp;&nbsp;" +
			        		"<button class=\"closeBtn\" title=\"Delete\" onclick=\"deleteOperationModel("+value.id+")\"><i class=\"fa fa-remove\"></i></button></td></tr>");
			    });
			    
			  } else {
				  $("tbody").append(" <tr><td  colspan=\"3\">No records to display</td></tr>");
			  }
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown) {
			  if(XMLHttpRequest.responseText.indexOf("Access token expired:")!=-1) {
				  getNewToken("roles.html");
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

function editOperationModel(id, role_name) {
	$("#edit_role_name").val(role_name);
	$("#edit_id").val(id);
	$("#editModal").modal('show');
}

function doAdd() {
	
	$.ajax({
		  type: "POST",
		  url: "http://localhost:8000/roles",
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
			    request.setRequestHeader("Content-Type", "application/json");
			  },
			  data: JSON.stringify({ "role_name": $("#new_role_name").val().trim() }),
		  success: function(msg){
			  $("#myModal").modal('hide');
			  $(".alert-success").show();
			  $(".alert-danger").hide();
			  $(".alert-success").html('<strong>Role added successfully</strong>');
			  getRolesList();
			  $("#new_role_name").val('');
			  
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown) {
			  if(XMLHttpRequest.responseText.indexOf("Access token expired:")!=-1) {
				  getNewTokenOnOperation(function() {
					  doAdd();
				  });
			  } else if(XMLHttpRequest.status==403) {
				  $("#myModal").modal('hide');
				  $(".alert-danger").html('<strong>You don\'t have the permission to do add a new role</strong>');
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
		  url: "http://localhost:8000/roles/"+$("#delete_id").val(),
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
			  },
		  success: function(msg){
			  $(".alert-success").show();
			  $(".alert-danger").hide();
			  $(".alert-success").html('<strong>Role deleted successfully</strong>');
			  $("#deleteModel").modal('hide');
			  getRolesList();
			  
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
				  $(".alert-danger").html('<strong>Users are assigned to this role. You can\'t delete.</strong>');
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
		  url: "http://localhost:8000/roles/"+$("#edit_id").val(),
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
			    request.setRequestHeader("Content-Type", "application/json");
			  },
			  data: JSON.stringify({ "role_name": $("#edit_role_name").val().trim() }),
		  success: function(msg){
			  $("#editModal").modal('hide');
			  $(".alert-success").show();
			  $(".alert-danger").hide();
			  $(".alert-success").html('<strong>Role updated successfully</strong>');
			  getRolesList();
			  
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