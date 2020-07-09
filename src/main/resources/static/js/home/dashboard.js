var GLOBALS = {
    demo:
    {
        userID: "9998306c-6bf6-46f4-b4f4-d2bfd1052418",
        appBaseURL: "http://localhost:8081"
    },
    data: {
        project: []
    }
}

$(document).ready(
    function () {


        findTeamMemberProject();
    });


function findTeamMemberProject() {

    $.ajax({
        method: "GET",
        url: "{appBaseURL}/project/team/member/{memberID}/project/find".replace("{appBaseURL}", GLOBALS.demo.appBaseURL).replace("{memberID}", GLOBALS.demo.userID),
        data: null,
        processData: false,
    }).done(
        function (data) {
            GLOBALS.data.project = data;
            renderProjects();
        });

}

function renderProjects() {
    var projectsContainer = $("#projects-container");
    GLOBALS.data.project.forEach(element => {
        var projectTemplate = $("#project-template").html();
        projectTemplate = replaceAll(projectTemplate, "{projectID}", element.projectID);

        projectsContainer.append(projectTemplate);
        var projectName = $("#project-name-{projectID}".replace("{projectID}", element.projectID));
        var projectDescription = $("#project-description-{projectID}".replace("{projectID}", element.projectID));
        var projectDescriptionLink = $("#project-description-link-{projectID}".replace("{projectID}", element.projectID));
        $(projectName).html(element.name);
        $(projectDescription).html(element.description);
        $(projectDescriptionLink).attr("href", "/board/" + element.projectID);
    });

}


function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}