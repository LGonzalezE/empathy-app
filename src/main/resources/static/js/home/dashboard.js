var GLOBALS = {    
    sesion: {
        user: null
    },
    data: {
        project: []
    }
}

$(document).ready(
    function () {
        
        if (localStorage.getItem("user") == null) {
            window.location.href = "/login";
            return;
        }

        GLOBALS.sesion.user = JSON.parse(localStorage.getItem("user"));
        $("#sesion-user-name").html(GLOBALS.sesion.user.name);
        
        findTeamMemberProject();
    });


function findTeamMemberProject() {

    $.ajax({
        method: "GET",
        url: "/project/team/member/{memberID}/project/find".replace("{memberID}", GLOBALS.sesion.user.userID),
        data: null,
        processData: false,
    }).done(
        function (data) {
            GLOBALS.data.project = [];
            for (var i = 0; i < data.length; i++) {

                GLOBALS.data.project[data[i].projectID] = data[i];
            }


            renderProjects();
        });

}

function renderProjects() {
    var projectsContainer = $("#projects-container");
    for (const [key, value] of Object.entries(GLOBALS.data.project)) {
        var project = GLOBALS.data.project[key];
        var projectTemplate = $("#project-template").html();
        projectTemplate = replaceAll(projectTemplate, "{projectID}", project.projectID);

        projectsContainer.append(projectTemplate);
        var projectName = $("#project-name-{projectID}".replace("{projectID}", project.projectID));
        var projectDescription = $("#project-description-{projectID}".replace("{projectID}", project.projectID));
        $(projectName).html(project.name);
        $(projectDescription).html(project.description);

    }

}

function openBoard(projectID) {
    var project = GLOBALS.data.project[projectID];
    
    localStorage.setItem("project", JSON.stringify(project));

    window.location.href = "/board/" + projectID;
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function logout(){
	localStorage.clear();
	window.location.href = "/";
}