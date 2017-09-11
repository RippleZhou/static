var User = window.User, Utils = window.Utils;

User.weichatAuth();

var urlparams = Utils.storage.get('befor_auth_params');

if (!User.getUser()) {
    User.innerlogin();
} else {
   loginSuccessThenDo();
}

function loginSuccessThenDo() {
        Utils.ajax.get('/IbabyWebService/camp/task/detail?campid=' + urlparams.campid + '&taskid=' + urlparams.taskid + '&patientid=' + User.getUser().patientid).then(function (rel) {
        if (rel.finished == 0) {
            location.href = urlparams.url;
        } else {
            Utils.ajax.get('/IbabyWebService/camp/member/detail?patientid=' + User.getUser().patientid).then(function (rel) {
                try {
                    var params = {
                        role: User.getUser().type,
                        campid: urlparams.campid,
                        taskid: urlparams.taskid,
                        patientid: User.getUser().patientid,
                        userid: User.getUser().patientid
                    }
                    Utils.ajax.post('/IbabyWebService/camp/comment/submit', params).then(function (rel) {
                        location.href = urlparams.url;
                    },function () {
                        location.href = urlparams.url;
                    })
                } catch (err) {
                    location.href = urlparams.url;
                }
            })
        }
    })
}