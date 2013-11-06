

(function($){
  $.fn.extend({

    jon_pager: function(cur_page , all_data) {
	
		var setting = {
			"default_page"	:	"2",	// Row table to show per page
			"default_list"	:	"5", 	// list page no in pager
			"ajax_call_url"	:	"main_process.php", // url to call for data with a new offset
			"data_format"	:	"from=get_criteria&cur_page=",	// data to send to ajax call url
			"filter_query"	:	"&col=xx&q=yy",
			"result_div"	:	"#show_cri", // div ID for show result table
			"filter_flag"	:	"1"		// Enabled filter information by input header
		}
		
		/*$(this).bind('click',function(){
			alert("555");
		});*/
		var html;
		var data;
		var all_page;
		var text;
		var col;
		var qarr; // query string array
		
		all_page = Math.ceil(all_data / parseInt(setting.default_page) );
		//var cur_page;
		
		// Count column
		var cnt_col="0";
		$(this).find("th").each(function(i){
			cnt_col = parseInt(cnt_col)+1;
			html = " <span style='display:none' class='show_filter'><img src='img/filter1.png'></img></span>";
			html = html + "<input style='display:none;width:100px' type='textbox' value='' />";
			$(this).append(html);
		});
		//alert(cnt_col);
		
		// Find current page
		/*cur_page = $(this).find("#hid_page").val();
		if (typeof cur_page === "undefined"){
			cur_page = "1";
		}*/
		
		// ******************** Filter **********************
		if (setting.filter_flag == "1") {
			$(".show_filter").show();
		}
		
		$(".show_filter").click(function(){
			$(".show_filter").next("input").hide();
			$(".show_filter").next("input").val("");
			$(this).next("input").show();
		});
		
		$(".show_filter").next("input").keyup(function(e){
			var code= e.which;
			text = $(this).val();
			col = $(this).parent().text();
			//alert(col);
			var query_string = setting.filter_query;
			query_string = query_string.replace("xx",col);
			query_string = query_string.replace("yy",text);
			
			if (code == 13) {
				//alert("You Enter");
				data = (setting.data_format) + "1" + query_string;
				//alert(data);
				$.ajax({
					type	:	"POST",
					url		:	setting.ajax_call_url,
					data	:	data,
					success	:	function(html){
									$(setting.result_div).html(html);
									$(".show_filter").parent("th:contains('"+col+"')").find("input").show();
									$(".show_filter").parent("th:contains('"+col+"')").find("input").val(text);
								}
				});
			}
		});
		
		// ******************** Pager ***********************
		//setting.default_page
		html = "";
		html = "<tr style='background-color:#fff'><td style='text-align:right' colspan="+cnt_col+">";
		html = html + "<style> .page_no { cursor:pointer; } </style>";
		html = html + "<input type='hidden' id='hid_page' value='"+cur_page+"' />";
		html = html + "<span id='prev' style='cursor:pointer;text-decoration:underline'>prev</span>";
		html = html + "&nbsp";
		if (all_page > setting.default_list) {
			html = html + "<span class='page_no'>"+1+"</span>&nbsp;...";
		}
		if (all_page <= setting.default_list) {
			for (var i=1;i<=all_page;i++) {
				if (i == cur_page) {
					html = html + "<span class='page_no'><b>"+i+"</b></span>&nbsp;";
				} else if ((i== (parseInt(cur_page)-1)) || (i== (parseInt(cur_page)-2))){
					html = html + "<span class='page_no'>"+i+"</span>&nbsp;";
				} else if ((i== (parseInt(cur_page)+1)) || (i== (parseInt(cur_page)+2))){
					html = html + "<span class='page_no'>"+i+"</span>&nbsp;";
				}
			}
		} else {
			for (var i=2;i<all_page;i++) {
				html = html + "<span class='page_no'>"+i+"</span>&nbsp;";
			}
		}
		
		if (all_page > setting.default_list) {
			html = html + "...&nbsp;<span class='page_no'>"+all_page+"</span>";
		}
		//html = html + "&nbsp";
		html = html + "<span id='next' style='cursor:pointer;text-decoration:underline'>next</span>";
		html = html + "</td></tr>"
		$(this).append(html);
		
		function CheckFilterData() {
			var text = "";
			var col ="";
			var jarr;
			$(".show_filter").next("input").each(function(i){
				text = $(this).val();
				col = $(this).parent("th").text();
				if (text != "") {
					return false;
				}
			});
			var query_string = setting.filter_query;
			query_string = query_string.replace("xx",col);
			query_string = query_string.replace("yy",text);
			jarr = [col,text,query_string];
			return jarr;
		}
		
		$("#next").click(function(){
			var next_page = (cur_page + 1);
			qarr = CheckFilterData();
			if (qarr[1] == "") {
				data = (setting.data_format) + next_page;
			} else {
				data = (setting.data_format) + next_page + qarr[2];
			}
			//alert(data);
			if (next_page <= all_page) {
				$.ajax({
					type	:	"POST",
					url		:	setting.ajax_call_url,
					data	:	data,
					success	:	function(html){
									$(setting.result_div).html(html);
									if (qarr[1] != "") {
										$(".show_filter").parent("th:contains('"+qarr[0]+"')").find("input").show();
										$(".show_filter").parent("th:contains('"+qarr[0]+"')").find("input").val(qarr[1]);
									}
								}
				});
			}
		});
		
		$("#prev").click(function(){
			var prev_page = (cur_page - 1);
			qarr = CheckFilterData();
			if (qarr[1] == "") {
				data = (setting.data_format) + prev_page;
			} else {
				data = (setting.data_format) + prev_page + qarr[2];
			}
			//alert(data);
			if (prev_page > 0) {
				$.ajax({
					type	:	"POST",
					url		:	setting.ajax_call_url,
					data	:	data,
					success	:	function(html){
									$(setting.result_div).html(html);
									if (qarr[1] != "") {
										$(".show_filter").parent("th:contains('"+qarr[0]+"')").find("input").show();
										$(".show_filter").parent("th:contains('"+qarr[0]+"')").find("input").val(qarr[1]);
									}
								}
				});
			}
		});
		
		$(".page_no").click(function(){
			var page = $(this).text();
			qarr = CheckFilterData();
			if (qarr[1] == "") {
				data = (setting.data_format) + page;
			} else {
				data = (setting.data_format) + page + qarr[2];
			}
			//alert(page);
			if (page != cur_page) {
				//data = (setting.data_format)+page;
				$.ajax({
					type	:	"POST",
					url		:	setting.ajax_call_url,
					data	:	data,
					success	:	function(html){
									$(setting.result_div).html(html);
									if (qarr[1] != "") {
										$(".show_filter").parent("th:contains('"+qarr[0]+"')").find("input").show();
										$(".show_filter").parent("th:contains('"+qarr[0]+"')").find("input").val(qarr[1]);
									}
								}
				});
			}
		});
    },

    jon_alert: function() {
      // Another method code
		//alert("something");
    }

  });
})(jQuery);