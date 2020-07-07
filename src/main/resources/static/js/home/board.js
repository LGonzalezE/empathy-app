var GLOBALS = {
    demo:
    {
        userID: "9998306c-6bf6-46f4-b4f4-d2bfd1052418",
        appBaseURL: "http://localhost:8081",
        projectID: "ad50bc8c-9e77-4973-9548-671e2606e2e5",
        sprintID: "5e302ac8-687f-443b-9ea4-340466d3090f"
    },
    templates: {
        daily: {
            issueMemberDailyID: {
                sprintID: null,
                projectID: null,
                issueID: null,
                memberID: null
            },
            statusID: null,
            description: null,
            createdDate: null,
            impediments: []
        },
        impediment: {
            projectID: null,
            typeID: "Impediment",
            name: null,
            description: null,
            effort: 0,
            ownerID: null,
            estimatedDate: null,
            createdDate: null
        }
    }
}


$(document).ready(
    function () {

        $("#sprint-name").html($("#sprintName").val());

        $("#sprint-stats-progress").css("width",
            $("#sprintStatsProgress").val() + "%");
        getBacklog();
    });

function getBacklog() {

    $.ajax({
        method: "GET",
        url: "{appBaseURL}/board/backlog/{projectID}/{sprintID}"
            .replace("{appBaseURL}", GLOBALS.demo.appBaseURL)
            .replace("{projectID}", GLOBALS.demo.projectID)
            .replace("{sprintID}", GLOBALS.demo.sprintID),
        data: null,
        processData: false,
    }).done(
        function (data) {

            var sprint = "#backlog-container";
            for (var i = 0; i < data.length; i++) {
                var issue = data[i];
                var issueContainerTemplate = $(
                    "#issue-container-template").html();

                // issue
                issueContainerTemplate = replaceAll(
                    issueContainerTemplate, "{issueID}", issue.issueID);
                //add issue
                $(sprint).append(issueContainerTemplate);
                $("#issue-description-" + issue.issueID).html(issue.description);

                // member
                var team = issue.metaData.team;
                var teamContainerID = "#issue-backlog-container-"
                    + issue.issueID;
                var teamContainer = $(teamContainerID);
                for (var t = 0; t < team.length; t++) {
                    var member = team[t];
                    var memberItemTemplate = $(
                        "#member-item-template").html();
                    memberItemTemplate = replaceAll(
                        memberItemTemplate, "{memberID}",
                        member.userID);

                    $(teamContainer).append(memberItemTemplate);
                    //member backlog
                    $("#member-name-" + member.userID).html(member.name);

                    var memberIssueProgressContainer = $("#member-backlog-container-" + member.userID);

                    var memberBacklog = member.metaData.backlog;

                    //for each issue in member backlog
                    for (var mb = 0; mb < memberBacklog.length; mb++) {
                        var memberIssue = memberBacklog[mb];
                        var memberIssueProgressLaneTemplate = $("#member-issue-progress-lane-template").html();
                        memberIssueProgressLaneTemplate = replaceAll(memberIssueProgressLaneTemplate, "{issueID}", memberIssue.issueID);
                        //add member issue
                        $(memberIssueProgressContainer).append(memberIssueProgressLaneTemplate);
                        var memberIssueID = "#member-issue-id-" + memberIssue.issueID;
                        var memberIssueName = "#member-issue-name-" + memberIssue.issueID;
                        var memberIssueDescription = "#member-issue-description-" + memberIssue.issueID;
                        var memberIssueProgressID = "#member-issue-progress-" + memberIssue.issueID;
                        $(memberIssueID).val(memberIssue.issueID);
                        $(memberIssueName).val(memberIssue.name);
                        $(memberIssueDescription).val(memberIssue.description);
                        $(memberIssueProgressID).css("width", memberIssue.metaData.progress);


                    }

                }
            }

        });
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}


function showDaily(issueID) {

    var memberIssueID = "#member-issue-id-" + issueID;
    var memberIssueName = "#member-issue-name-" + issueID;
    var memberIssueDescription = "#member-issue-description-" + issueID;

    $("#daily-modal").modal("show");
    $("#daily-modal-issue-name").val($(memberIssueName).val());
    console.log(issueID);

}