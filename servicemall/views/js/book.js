/**
 * Created by rvM on 2017/1/13.
 */
wechat.share();
$(function () {
    var user = Services.getChannelUser() || User.getUser();

    if (!user) {
        User.redirectToLoginPage('/static/servicemall/');
        return;
    }

    var queryParams = Utils.getQueryParams();
    var serviceName;

    $('#phone').val(user.mobilenum);
    // $('#name').val(user.realname);

    var promise = Services.getService().then(function (result) {
        //result.doctors = JSON.parse(result.doctors);
        result.flows = JSON.parse(result.flows);
        result.ways = JSON.parse(result.ways);
        result.isRecommended = Services.isRecommended();
        result.suppliers = JSON.parse(result.suppliers);
        switch (result.categorytype) {
            case 'A':
                $('.row-datetime').removeClass('hide');
                //临时添加
                result.address = ["上海市静安区华山路2号高和大厦1003","1"];
                $.each(result.ways, function (index, way) {
                    if (way.scode != 'phone') {
                        way.pays = [{price: way.price, address: result.address}];
                    }
                });

                break;
            case 'B':
                $('.row-datetime').removeClass('hide');

                var doctor;

                //for (var i = 0, n = result.doctors.length; i < n; i++) {
                //doctor = result.doctors[i];
                doctor = result.doctors;

                if (doctor.id == queryParams.doctor || !queryParams.doctor) {
                    $.each(result.ways, function (index, way) {
                        if (way.scode != 'phone') {
                            way.pays = [{price: way.price, address: doctor.address}];
                        }
                    });
                    break;
                }
                //}

                break;
            case 'C':
            case 'E':
                $('.row-datetime').removeClass('hide');

                var pays = $.map(result.suppliers || [], function (s, i) {
                    var price = s.discount || s.price;
                    return {price: price, unit: price > 0 ? s.unit : '线下支付', address: s.address};
                });

                result.ways = [{
                    scode: 'clinic',
                    title: '实体门诊',
                    price: pays[0] ? pays[0].price : '',
                    unit: pays[0] ? pays[0].unit : '',
                    pays: pays
                }];
                break;
        }

        serviceName = result.servicename;
        document.title += '-' + serviceName;
        $('body').prepend(template('tpl-ways', result));

        if (result.ways) {
            var $ways = $('.ways');

            $ways.find('.way').each(function (i) {
                $(this).data('way', result.ways[i]).on('click', function () {
                    selectWay(i);
                });
            });

            $ways.find('.ways-mark').css('width', 100 / result.ways.length + '%');
        }

        return result.ways;
    });

    $.when(promise, Services.getServiceAvaliableTimes()).then(function (ways, avaliableTimes) {
        if (!ways || !avaliableTimes) {
            return;
        }

        var wayTimes = {};

        $.each(ways, function (i, w) {
            wayTimes[w.scode] = w;
        });

        $.each(avaliableTimes.waystatus, function (i, d) {
            if (wayTimes[d.waycode]) {
                wayTimes[d.waycode].times = d.availabledatetime;
            }
        });

        selectWay(0);
    });

    $('select').on('change', function () {
        var $this = $(this);
        var $prev = $this.prev();

        if ($this.val()) {
            $prev.removeClass('placeholder').text($this.find('option:selected').text());
        }
        else {
            $prev.addClass('placeholder').text($this.attr('placeholder'));
        }
    });

    $('#date').on('change', function () {
        var times = [''].concat($(this).find('option:selected').data('times'));
        var $time = $('#time');

        $time.html($.map(times, function (d) {
            if (d) {
                return '<option value="' + d.period + '"' + (d.available ? '' : ' disabled') + '>' + d.period + (d.available ? '' : ' (已被预约)') + '</option>';
            }

            return '<option value="">' + $time.attr('placeholder') + '</option>';
        })).val('').trigger('change');
    });

    $('#time').on('click', function (evt) {
        if (!$('#date').val()) {
            aid.tip.show('请先选择日期！');
            evt.preventDefault();
        }
    });

    $('#book-confirm').on('click', function() {
        var $this = $(this);
        var $phone = $('#phone');
        var $name = $('#name');
        var $address = $('#address');
        var $date = $('#date');
        var $time = $('#time');

        var wayObject = $('.ways .way.active').data('way') || {};
        var isAddressVisible = $address.parents('.row').is(':visible');
        var isDatetimeVisible = $date.parents('.row').is(':visible');

        if (!$phone.val()) {
            aid.tip.show('请输入手机号码');
            return;
        }
        if ($phone.val().length != 11 || $phone.val().charAt(0) != '1') {
            aid.tip.show('手机号码格式不正确');
            return;
        }
        if (!$name.val()) {
            aid.tip.show('请输入真实姓名');
            return
        }
        if (isAddressVisible && !$address.val()) {
            aid.tip.show('请选择服务地址');
            return;
        }
        if (isDatetimeVisible && (!$date.val() || !$time.val())) {
            aid.tip.show('请选择预约时间');
            return;
        }
        /*
         * returnurl,为支付成功后跳转的页面
         * imgsrc为展示图链接
         * business 表示订单源
         * */
        var orderparams = {
            serviceid:queryParams.id,
            categorytype: queryParams.categorytype,
            pname: serviceName,
            servicename: serviceName,
            sway: wayObject.scode,
            price: wayObject.price,
            totalfee: wayObject.price,
            name: $name.val(),
            phone: $phone.val(),
            mobile: $phone.val(),
            addr: isAddressVisible ? $address.find('option:selected').text() : null,
            time: isDatetimeVisible ? $date.val() + ' ' + $time.val() : null,
            patientid: User.getUser().patientid,
            business: 'servicemall',
            isonline: '1',
            message: '预约成功！为保证服务质量，爱丁医生稍后将与您联系，向您解释服务细节。',
            returnurl: '/static/servicemall/index.html'
        };
        var urlparams = '?';
        for ( var i in orderparams) {
            urlparams = urlparams+i+'='+orderparams[i]+'&';
        }
        location.href = '/static/common/pay/order.html'+urlparams;

    });

    function selectWay(index) {
        var $ways = $('.ways');
        var $way = $('.ways').find('.way').removeClass('active');

        var $address = $('#address');
        var $date = $('#date');
        var $time = $('#time');

        var wayObject = $way.eq(index).addClass('active').data('way') || {};

        $ways.find('.ways-mark').css('left', 100 * index / $way.length + '%');

        if (wayObject.pays) {
            /*
             $address.html($.map(wayObject.pays, function (d) {
             return '<option value="' + d.price + '">' + d.address + '</option>';
             }));

             if (wayObject.pays.length == 1) {
             $address.prev().removeClass('placeholder').text(wayObject.pays[0].address);
             $address.val(wayObject.pays[0].price);
             }
             else {
             $address.prev().addClass('placeholder').text($address.attr('placeholder'));
             $address.val('');
             }
             */

            $address.parents('.row').removeClass('hide');
        }
        else {
            /*
             $address.prev().addClass('placeholder').text($address.attr('placeholder'));
             $address.html('').val('');
             $address.parents('.row').addClass('hide');
             */
        }

        $date.val('').html('').prev().addClass('placeholder').text($date.attr('placeholder'));
        $time.val('').html('').prev().addClass('placeholder').text($time.attr('placeholder'));

        if (wayObject.times) {
            var times = [{clock: []}].concat(wayObject.times);
            $date.html($.map(times, function (d) {
                if (d.date) {
                    var dates = d.date.split('-');
                    return '<option value="' + d.date + '">' + new Date(dates[0], dates[1] - 1, dates[2]).format('MM月DD日 周E') + '</option>';
                }

                return '<option value="">' + $date.attr('placeholder') + '</option>';
            }));

            $date.find('option').each(function (i) {
                $(this).data('times', times[i].clock);
            });
        }
    }

});