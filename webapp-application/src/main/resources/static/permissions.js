$(document).ready(function(){
	getPermissionsList();
});
function getPermissionsList() {
	$.ajax({ 
		  type: "GET",
		  url: "http://localhost:8000/permissions",
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
			  },
		  success: function(msg){
			  if(msg.length>0) {
			    $.each(msg, function (index, value) {
			        $("tbody").append(" <tr><td>"+(index+1)+"</td><td>"+value.permission_name+"</td></tr>");
			    });
			  } else {
				  $("tbody").append(" <tr><td  colspan=\"2\">No records to display</td></tr>");
			  }
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown) {
			  if(XMLHttpRequest.responseText.indexOf("Access token expired:")!=-1) {
				  getNewToken("permissions.html");
			  } else if(XMLHttpRequest.status==403) {
				  $("table").remove(); $(".alert-danger").show();
			   } else { localStorage.clear(); window.location.href="index.html"; }
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