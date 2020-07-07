var GLOBALS = {
    demo:
    {
        userID: "9998306c-6bf6-46f4-b4f4-d2bfd1052418",
        appBaseURL: "http://localhost:8081"
    }
}

$(document).ready(
    function () {


        findProjectByOwnerID();
    });

function findProjectByOwnerID() {

    $.ajax({
        method: "GET",
        url: "{appBaseURL}/project/u/{ownerID}/find".replace("{appBaseURL}", GLOBALS.demo.appBaseURL).replace("{ownerID}", GLOBALS.demo.userID),
        data: null,
        processData: false,
    }).done(
        function (data) {
            var projectsContainer = $("#projects-container");
            data.forEach(element => {
                var projectTemplate = $("#project-template").html();
                projectTemplate = replaceAll(projectTemplate, "{projectID}", element.projectID);

                projectsContainer.append(projectTemplate);
                findSprintByProjecId(element.projectID);
                var projectName = $("#project-name-{projectID}".replace("{projectID}", element.projectID));
                var projectDescription = $("#project-description-{projectID}".replace("{projectID}", element.projectID));
                $(projectName).html(element.name);
                $(projectDescription).html(element.description);
            });


        });
}

function findSprintByProjecId(projectID) {

    $.ajax({
        async: false,
        cache: false,
        method: "GET",
        url: "{appBaseURL}/sprint/u/{ownerID}/project/{projecID}".replace("{appBaseURL}", GLOBALS.demo.appBaseURL).replace("{ownerID}", GLOBALS.demo.userID).replace("{projecID}", projectID),
        data: null,
        processData: false,
    }).done(
        function (data) {

            var projectsContainer = $("#projects-container");
            data.forEach(element => {
                //return first for demo purpose                
                $("#project-description-link-{projectID}".replace("{projectID}", projectID)).attr("href",
                    "{appBaseURL}/board/{projectID}/{sprintID}".replace("{appBaseURL}", GLOBALS.demo.appBaseURL)
                        .replace("{projectID}", projectID)
                        .replace("{sprintID}", element.sprintID.sprintID));
                return element.sprintID;

            });


        });
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}