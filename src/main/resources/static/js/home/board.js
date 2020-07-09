var GLOBALS = {
    demo:
    {
        userID: "9998306c-6bf6-46f4-b4f4-d2bfd1052418",
        appBaseURL: "http://localhost:8081",
        projectID: "22753F4D3598484AB4DA086B7532BCE7"
    },
    defaults:
    {
        sprint: { statusID: "DOING" }
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
    },
    data: {
        sprint: {
            backlog: {
                root: []
            }
        },
        issue: [],
        user: []

    }
}


$(document).ready(
    function () {

        getProjectSprintByStatus();


    });


function getProjectSprintByStatus() {
    var url = "{appBaseURL}/sprint/project/{projectID}/status/{statusID}/find"
        .replace("{appBaseURL}", GLOBALS.demo.appBaseURL)
        .replace("{projectID}", GLOBALS.demo.projectID)
        .replace("{statusID}", GLOBALS.defaults.sprint.statusID);


    $.ajax({
        method: "GET",
        url: url,
        data: null,
        processData: false,
    }).done(
        function (data) {

            GLOBALS.data.sprint = data[0];
            renderSprint();
            findRootBySprintID();

        });

}


function renderSprint() {
    var sprint = GLOBALS.data.sprint;

    $("#sprint-header-name").html(sprint.name);
    $("#sprint-header-metadata-progress").css("width", sprint.metaData.progress + "%");

}

function findRootBySprintID() {

    var url = "/sprint/backlog/issue/sprint/{sprintID}/root".replace("{sprintID}", GLOBALS.data.sprint.sprintID.sprintID);

    $.ajax({
        method: "GET",
        url: url,
        data: null,
        processData: false,
    }).done(
        function (data) {
            console.log(data);
            for (var index = 0; index < data.length; index++) {
                var issue = data[index];
                GLOBALS.data.issue[issue.issueID] = issue;
                if (typeof GLOBALS.data.sprint.backlog == 'undefined') {
                    GLOBALS.data.sprint.backlog = {};
                    GLOBALS.data.sprint.backlog.root = [];
                }
                GLOBALS.data.sprint.backlog.root.push(issue.issueID);
                renderBacklogRoot(issue.issueID);
            }

            findByChildsByParentID();
        });

}

function findByChildsByParentID() {

    var root = GLOBALS.data.sprint.backlog.root;

    for (var rootIndex = 0; rootIndex < root.length; rootIndex++) {
        var parentID = root[rootIndex];
        var url = "/sprint/backlog/issue/{parentID}/childs/find".replace("{parentID}", parentID);

        $.ajax({
            method: "GET",
            url: url,
            data: null,
            processData: false,
        }).done(
            function (data) {

                for (var childIndex = 0; childIndex < data.length; childIndex++) {
                    var child = data[childIndex];

                    GLOBALS.data.issue[child.issueID] = child;
                    var parentIssue = GLOBALS.data.issue[child.parentID];
                    if (typeof parentIssue.teamMembers == 'undefined')
                        parentIssue.teamMembers = [];
                    if (!parentIssue.teamMembers.includes(child.ownerID)) {
                        parentIssue.teamMembers.push(child.ownerID);
                    }

                    if (typeof parentIssue.child == 'undefined')
                        parentIssue.child = [];
                    if (!parentIssue.child.includes(child.issueID)) {
                        parentIssue.child.push(child.issueID);
                    }
                }
                if (data.length > 0) {
                    var rootIssueID;
                    rootIssueID = data[0].parentID;
                    renderRootIssueTeamMember(rootIssueID);
                }

            });
    }

}
function renderRootIssueTeamMember(rootIssueID) {
    var rootIssue = GLOBALS.data.issue[rootIssueID];
    var teamMembers = rootIssue.teamMembers;
    var teamContainerID = "#issue-backlog-container-" + rootIssue.issueID;
    var teamContainer = $(teamContainerID);

    for (var memberIndex = 0; memberIndex < teamMembers.length; memberIndex++) {
        var memberID = teamMembers[memberIndex];
        var memberItemTemplate = $("#member-item-template").html();
        memberItemTemplate = replaceAll(memberItemTemplate, "{memberID}", memberID);
        memberItemTemplate = replaceAll(memberItemTemplate, "{issueID}", rootIssue.issueID);
        $(teamContainer).append(memberItemTemplate);
        getUser(memberID);
    }

    renderTeamMemberBacklog(rootIssue.issueID);
}

function getUser(userID) {

    var url = "/user/{userID}".replace("{userID}", userID);
    $.ajax({
        method: "GET",
        url: url,
        data: null,
        processData: false,
    }).done(
        function (data) {
            GLOBALS.data.user[data.userID] = data;
            var userAvatarID = "user-avatar-" + data.userID;
            $("[id='" + userAvatarID + "']").each(function (e) {
                var userID = $(this).attr("data-userID");
                var img = "/img/avatar/" + userID + ".png";
                $(this).attr("src", img);
            });

            var userNameID = "user-name-" + data.userID;
            $("[id='" + userNameID + "']").each(function (e) {
                var userID = $(this).attr("data-userID");
                var user = GLOBALS.data.user[userID];
                $(this).html(user.name);
            });
            return data;
        });

}



function renderBacklogRoot(issueID) {

    var backlogContainer = "#backlog-container";
    var rootIssue = GLOBALS.data.issue[issueID];
    var rootIssueContainerTemplate = $("#issue-container-template").html();
    rootIssueContainerTemplate = replaceAll(rootIssueContainerTemplate, "{issueID}", rootIssue.issueID);
    $(backlogContainer).append(rootIssueContainerTemplate);
    $("#issue-description-" + rootIssue.issueID).html(rootIssue.description);
}

function renderTeamMemberBacklog(rootIssueID) {
    var rootIssue = GLOBALS.data.issue[rootIssueID];
    var childs = rootIssue.child;

    for (var childIndex = 0; childIndex < childs.length; childIndex++) {
        var childID = childs[childIndex];
        var child = GLOBALS.data.issue[childID];        
        var memberIssueProgressContainer = $("#member-backlog-container-" + child.parentID + "-" + child.ownerID);
        var memberIssueProgressLaneTemplate = $("#member-issue-progress-lane-template").html();
        memberIssueProgressLaneTemplate = replaceAll(memberIssueProgressLaneTemplate, "{issueID}", child.issueID);
        //add member issue                
        $(memberIssueProgressContainer).append(memberIssueProgressLaneTemplate);
        var memberIssueProgressID = "#member-issue-progress-" + child.issueID;
        $(memberIssueProgressID).css("width", "50%");
    }


}



function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}


function showDaily(issueID) {
    var issue = GLOBALS.data.backlog.issues[issueID];
    console.log(issueID);
    $("#daily-modal").modal("show");
    $("#daily-modal-issue-name").val(issue.name);
    $("#daily-modal-issue-id").val(issue.issueID);
}

function saveDaily() {
    var issueID = $("#daily-modal-issue-id").val();
    var issue = GLOBALS.data.backlog.issues[issueID];
    var daily = GLOBALS.templates.daily;

    daily.issueMemberDailyID.sprintID = $("#sprint-id").val();
    daily.issueMemberDailyID.projectID = $("#project-id").val();
    daily.issueMemberDailyID.issueID = issue.issueID;
    daily.issueMemberDailyID.memberID = GLOBALS.demo.userID;
    daily.createdDate = null;
    daily.description = $("#daily-modal-description").val();
    daily.statusID = $("#daily-modal-status-id").val();

    var url = "{appBaseURL}/sprint/u/daily"
        .replace("{appBaseURL}", GLOBALS.demo.appBaseURL);

    console.log("[POST] " + url);

    $.ajax({
        contentType: "application/json; charset=utf-8",
        method: "POST",
        url: url,
        data: JSON.stringify(daily),
        processData: false,
    }).done(
        function (data) {
            console.log(data);
        });

}



