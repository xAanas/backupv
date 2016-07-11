/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var orga_id = "";
jQuery("document").ready(function () {
    jQuery("#org_save").submit(function () {
        var data = {
            "contact_id": "1111",
            "org_id": "2222"
        };
        data = jQuery(this).serialize() + "&" + jQuery.param(data);
        var oarg_val_name = jQuery("#org_name").val();
        var oarg_val_email = jQuery("#org_email").val();
        var oarg_val_country = jQuery("#org_list_country").val();
        var oarg_val_thematique = jQuery("#org_list_thematique").val();
        var oarg_val_languages_is_checked = false;
        jQuery("input[name='org_list_languages[]']").each(function () {
            var checked_val = jQuery(this)[0].checked;
            if (checked_val == true) {
                oarg_val_languages_is_checked = true;
            }
        });
        if (oarg_val_name.toString() !== '' && oarg_val_email.toString() !== '' && oarg_val_email.toString() !== '' && oarg_val_thematique.toString() !== '' && oarg_val_languages_is_checked.toString() === 'true') {
            jQuery.ajax({
                type: "POST",
                dataType: "json",
                url: "?q=Organisation/save",
                data: data,
                enctype: "multipart/form-data",
                uploadMultiple: true,
                success: function (data) {
                    orga_id = data.id;
                    base_url = data.base_url;
                    urlFile = data.urlFile;
                    handleForm(orga_id, base_url, urlFile);
                }
            });
        } else {
        	var message1 = Drupal.t('The fields Name, Email, Thematique, Country, Language are required');
            add_events_display_message('error', message1);
        }
        return false;
    });
});


function handleFileSelect(e) {
    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function (f) {

        if (!f.type.match("image.*")) {
            return;
        }
        storedFiles.push(f);

        var reader = new FileReader();
        reader.onload = function (e) {
            selDiv.append(html);

        };
        reader.readAsDataURL(f);
    });

}


var selDiv = "";
var storedFiles = [];

jQuery(document).ready(function () {
    jQuery("#files").on("change", handleFileSelect);
    selDiv = jQuery("#selectedFiles");
    //jQuery("#org_save").on("submit", handleForm);
    jQuery("body").on("click", ".selFile", removeFile);
});

function handleFileSelect(e) {
    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function (f) {

        if (!f.type.match("image.*")) {
            return;
        }
        storedFiles.push(f);

        var reader = new FileReader();
        reader.onload = function (e) {
            var html = "<div><img src=\"" + e.target.result + "\" data-file='" + f.name + "' style='width:80px;height:60px;' class='selFile' title='Click to remove'>" + f.name + "<br clear=\"left\" /></div>";
            selDiv.append(html);

        };
        reader.readAsDataURL(f);
    });

}

function handleForm(orga_id, base_url, urlFile) {
    var data = new FormData();

    for (var i = 0, len = storedFiles.length; i < len; i++) {
        data.append('files', storedFiles[i]);
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '?q=Organisation/upload&id=' + orga_id + '&pathFile=' + urlFile, true);

    xhr.onload = function (e) {
        if (this.status == 200) {
            window.location.assign(base_url + '/?q=Organisation/data&org_id=' + orga_id);
        }
    };

    xhr.send(data);
}

function removeFile(e) {
    var file = jQuery(this).data("file");
    for (var i = 0; i < storedFiles.length; i++) {
        if (storedFiles[i].name === file) {
            storedFiles.splice(i, 1);
            break;
        }
    }
    jQuery(this).parent().remove();
}

/* remplire les champs d'organisation pour les métres a jours */
jQuery("document").ready(function () {
    var org_id = jQuery("#edit_org_by_id").val();
    var edit_org_by_id = jQuery("#edit_org_by_id").val();
    var base_url = jQuery("#base_url").val();
    if (edit_org_by_id > 0) {
        var data = {"true": "true"};
        jQuery.ajax({
            type: "GET",
            dataType: "json",
            url: "?q=api/dataOrganisations/&org_id=" + edit_org_by_id,
            data: data,
            enctype: "multipart/form-data",
            uploadMultiple: true,
            success: function (data) {
                if (data.loged_user_id == data.creator_org_info.contact_id) {
                    var get_organisation_info_by_id = data.get_organisation_info_by_id;
                    for (var edit_org_by_id in get_organisation_info_by_id) {
                        var initiative = get_organisation_info_by_id[edit_org_by_id];
                        jQuery("#org_name").val(initiative.organization_name);
                        jQuery("#org_email").val(initiative.email);
                        jQuery("#org_phone").val(initiative.phone);
                        jQuery("#org_note").val(data.org_note);
                        if (initiative.country_id > 0) {
                            jQuery("#org_list_country").val(initiative.country_id);
                        }
                        jQuery("#org_note").val(data.org_note);
                        jQuery("#inputTwitter").val(data.org_twiterWebSite);
                        jQuery("#org_compte_blog_web_site").val(data.org_mainWebSite);
                        jQuery("input[id=org_list_champ_activite][value='" + data.champ_activity + "']").attr("checked", "checked");
                        jQuery("input[id=org_list_thematique][value='" + data.champ_thematique + "']").attr("checked", "checked");
                        jQuery("input[name='org_list_languages[]']").each(function () {
                            var resListDisponibleLangueges = data.champ_languages.split(" ");
                            var curentLanguges = jQuery(this).val();
                            var itExistLanguges = resListDisponibleLangueges.indexOf(curentLanguges);
                            if (itExistLanguges >= 0) {
                                jQuery(this).checkbox({checked: true});
                            }
                        });
                        jQuery("input[name='org_list_nature[]']").each(function () {
                            var resListDisponibleNature = data.champ_natureField.split(" ");
                            var curentNature = jQuery(this).val();
                            var itExistNature = resListDisponibleNature.indexOf(curentNature);
                            if (itExistNature >= 0) {
                                jQuery(this).checkbox({checked: true});
                            }
                        });
                    }
                } else {
                    alert('you schoud not edit this organisation');
                    window.location.assign(base_url + '/?q=Organisation/data&org_id=' + org_id);
                }
            }
        });
    }
});

jQuery("document").ready(function () {
    jQuery("#valide_event_act").submit(function () {
        var data = {"contact_id": "1111"};
        data = jQuery(this).serialize() + "&" + jQuery.param(data);
        jQuery.ajax({
            type: "POST",
            dataType: "json",
            url: "?q=api/events/valid/action",
            data: data,
            enctype: "multipart/form-data",
            uploadMultiple: true,
            success: function (data) {
                if (data.end_validation == "ok") {
                    window.location.assign(data.base_url + '/?q=Events/listToValidate');
                }
            }
        });
        return false;
    });
    /*jQuery("#destroyEvent").click(function () {
     if (confirm("Are you sure you want to delete this?")) {
     var eventToDelete = this.name;
     var base_url = this.value;
     
     
     }
     return false;
     });*/

    jQuery(document).click(function (e) {
        var id_event_btt = jQuery(e.target).attr("id");
        var id_event_btt_url = jQuery(e.target).attr("value");
        if (typeof id_event_btt !== 'undefined') {
            var btt = id_event_btt.substr(0, 3);
            var id_event = id_event_btt.substr(3);
            if (btt == 'btt' && parseInt(id_event) > 0) {
                console.log(id_event_btt_url);
                if (confirm("Are you sure you want to delete this?")) {
                    var data = {"event_id": id_event};
                    data = jQuery(this).serialize() + "&" + jQuery.param(data);
                    jQuery.ajax({
                        type: "POST",
                        dataType: "json",
                        url: "?q=api/events/delete/action",
                        data: data,
                        enctype: "multipart/form-data",
                        uploadMultiple: true,
                        success: function (data) {
                            if (data.end_destroy == "ok") {
                                window.location.assign(id_event_btt_url + '/?q=Events/listToValidate');
                            }
                        }
                    });
                }
            }
        }
        //return false;
    });
});

