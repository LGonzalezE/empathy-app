var GLOBALS = {    
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
    sesion: {
        user: null
    },
    data: {
        project: null,
        sprint: {
            backlog: {
                root: []
            }
        },
        issue: [],
        user: [],
        daily: null

    }
}


$(document).ready(
    function () {

        if (localStorage.getItem("user") == null) {
            window.location.href = "/dashboard";
            return;
        }

        GLOBALS.sesion.user = JSON.parse(localStorage.getItem("user"));
        $("#sesion-user-name").html(GLOBALS.sesion.user.name);
        
        GLOBALS.data.project = JSON.parse(localStorage.getItem("project"));
        getProjectSprintByStatus();



    });


function getProjectSprintByStatus() {
    var url = "/sprint/project/{projectID}/status/{statusID}/find"
        .replace("{projectID}", GLOBALS.data.project.projectID)
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
        $(memberIssueProgressID).css("width", child.metaData.progress + "%");
    }


}



function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}


function showDaily(issueID) {
    var issue = GLOBALS.data.issue[issueID];
    $("#daily-modal").modal("show");
    $("#daily-modal-issue-name").val(issue.name);
    $("#daily-modal-issue-id").val(issue.issueID);
    $("#daily-modal-description").val("");
}

function saveDaily() {
    var issueID = $("#daily-modal-issue-id").val();
    var sprint = GLOBALS.data.sprint;
    var issue = GLOBALS.data.issue[issueID];
    var daily = GLOBALS.templates.daily;


    daily.issueMemberDailyID.sprintID = sprint.sprintID.sprintID;
    daily.issueMemberDailyID.projectID = issue.projectID;
    daily.issueMemberDailyID.issueID = issue.issueID;
    daily.issueMemberDailyID.memberID = GLOBALS.sesion.user.userID;
    daily.createdDate = null;
    daily.description = $("#daily-modal-description").val();
    daily.statusID = $("#daily-modal-status-id").val();

    var url = "/sprint/u/daily";

    GLOBALS.data.daily = daily;
    //bloqued

    if (daily.statusID == "3") {

        showImpediment(issueID);
    }
    else {

        $.ajax({
            contentType: "application/json; charset=utf-8",
            method: "POST",
            url: url,
            data: JSON.stringify(daily),
            processData: false,
        }).success(
            function (data) {
                $("#daily-modal").modal("hide");
            });

    }

}

function showImpediment(issueID) {
    $("#impediment-modal").modal("show");
    $("#impediment-name").val("");
    $("#impediment-description").val("");
}


function saveImpediment() {

    var url = "/sprint/u/daily";
    var impediment = GLOBALS.templates.impediment;
    var daily = GLOBALS.data.daily;
    impediment.name = $("#impediment-name").val();
    impediment.description = $("#impediment-description").val();
    daily.impediments=[];
    daily.impediments.push(impediment);

    console.log(daily);

    $.ajax({
        contentType: "application/json; charset=utf-8",
        method: "POST",
        url: url,
        data: JSON.stringify(daily),
        processData: false,
    }).success(
        function (data) {
            $("#impediment-modal").modal("hide");
            $("#daily-modal").modal("hide");
        });

}

function logout(){
	localStorage.clear();
	window.location.href = "/";
}