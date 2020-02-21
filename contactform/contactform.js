jQuery(document).ready(function($) {
  "use strict";

  //Contact
  $('form.contactForm').submit(function() {
    var f = $(this).find('.form-group'),
      ferror = false,
      emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    f.children('input').each(function() { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;

          case 'email':
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;

          case 'checked':
            if (! i.is(':checked')) {
              ferror = ierror = true;
            }
            break;

          case 'regexp':
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    f.children('textarea').each(function() { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    if (ferror) return false;
  });

  // document.getElementById("lm").addEventListener("click",function()
  // {
  //   document.getElementById('tvfandom').focus();
  // }

  // document.getElementById("submit").addEventListener("click",function()
  // {
  //     var name=document.getElementById("name").value;
  //     var email=document.getElementById("email").value;
  //     var subject=document.getElementById("subject").value;
  //     var msg=document.getElementById("message").value;
  //     if(name.length>=4)
  //     {
  //         alert("hello");
  //         document.getElementById("nval").style.display="none";
  //         if(/^\w+([\.-]?\w+)*@\w{2,9}([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
  //         {
  //             document.getElementById("eval").style.display="none";
  //             if(subject.length>=4)
  //             {
  //                 document.getElementById("sval").style.display="none";
  //                 if(msg!="")
  //                 {
  //                   document.getElementById("sendmessage").style.display="block";
  //                   document.getElementById("nval").style.display="none";
  //                 }
  //                 else
  //                 {
  //                   document.getElementById("sendmessage").style.display="none";
  //                 }
  //             }
  //             else
  //             {
  //               document.getElementById("sendmessage").style.display="none";
  //             }
  //         }
  //         else
  //         {
  //           document.getElementById("sendmessage").style.display="none";
  //         }
  //     }
  //     else
  //     {
  //       document.getElementById("sendmessage").style.display="none";
  //     }
  // });

});
