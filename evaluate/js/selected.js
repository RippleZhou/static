/**
 * Created by rvM on 2016/11/1.
 */
$('#questions').delegate('label', 'click', function () {
    var theradio = $(this).find('.radio');
    if (theradio.hasClass('more')) {
        theradio.toggleClass('selected');
    } else {
        if (!theradio.hasClass('selected')) {
            theradio.parents('.answers').find('.radio').removeClass('selected');
            theradio.addClass('selected');
        }
    }
})