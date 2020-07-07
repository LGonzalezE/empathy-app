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
        url: "http://localhost:8081/board/backlog/ad50bc8c-9e77-4973-9548-671e2606e2e5/5e302ac8-687f-443b-9ea4-340466d3090f",
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
                    $("#member-name-"+member.userID).html(member.name);

                    var memberIssueProgressContainer = $("#member-backlog-container-" + member.userID);
                    console.log("#member-backlog-container-" + member.userID);
                    var memberBacklog = member.metaData.backlog;

                    //for each issue in member backlog
                    for (var mb = 0; mb < memberBacklog.length; mb++) {
                        var memberIssue = memberBacklog[mb];
                        var memberIssueProgressLaneTemplate = $("#member-issue-progress-lane-template").html();
                        memberIssueProgressLaneTemplate = replaceAll(memberIssueProgressLaneTemplate, "{issueID}", memberIssue.issueID);
                        console.log(memberIssueProgressLaneTemplate);
                        //add member issue
                        $(memberIssueProgressContainer).append(memberIssueProgressLaneTemplate);

                    }

                }
            }

        });
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}