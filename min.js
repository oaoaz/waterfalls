window.onload = function(){

	$(function(){

	var iWidth = 220;  //列宽
	var iSpace = 10;   //间隔宽
	var iOuterWidth = iWidth + iSpace;  //实际列宽
	var iCells = 0; // 总列数
	var oContainer = $('#container'); 
	var oLoader = $('#loader');
	var iPage = 0;
	var sUrl = 'http://www.wookmark.com/api/json/popular?callback=?';
	var flag = true;

	var arrL = [];
	var arrT = [];

	function setCells(){
		iCells = Math.floor($(window).innerWidth() / iOuterWidth);

		if(iCells < 3) {
			iCells = 3;
		}
		if(iCells > 8) {
			iCells = 8;
		}

		oContainer.css('width', iOuterWidth * iCells - iSpace);
	}
	setCells();

	for(var i = 0; i < iCells; i++){ //初始化
		arrT.push(0);
		arrL.push(i * iOuterWidth);
	}
	// console.log(arrL);
	
	function getData() {
		if(flag) {
			flag = false;
			oLoader.show();

			$.getJSON(sUrl, 'page=' + iPage, function(data){
		
			$.each(data, function(index, obj){
				var oImg = $('<img />');
				oImg.attr('src', obj.preview);
				oContainer.append(oImg);
						//缩小比例
				var iHeight = iWidth / obj.width * obj.height;

				oImg.css({
				width : iWidth,
				height : iHeight
				});
			//获取最小值所在的位置
				var iMinIndex = getMin();
			//设置定位
				oImg.css({
					left : arrL[iMinIndex],
					top : arrT[iMinIndex]
				});
				arrT[iMinIndex] += iHeight + 10;

				oLoader.hide();

				flag = true;

				});
			});
		}
		
	}

	getData();

	$(window).on('scroll', function(){

		var iH = $(window).scrollTop() + $(window).innerHeight();
		var iMinIndex = getMin();


		if(arrT[iMinIndex] + oContainer.offset().top < iH){
			iPage++;
			getData();
		}
	});

	$(window).on('resize', function (){ //缩放补图片

		var olderCells = iCells;

		setCells();
		
		if(olderCells == iCells) {
			return ;
		}
		arrT = [];
		arrL = [];

		for(var i = 0; i < iCells; i++){ //初始化
			arrT.push(0);
			arrL.push(i * iOuterWidth);
		}

		var aImgs = oContainer.find('img');

		aImgs.each(function() {
			
			var iMinIndex = getMin();

			// $(this).css({
			// 		left : arrL[iMinIndex],
			// 		top : arrT[iMinIndex]
			// 	});
			
			$(this).animate({
				left : arrL[iMinIndex],
				top : arrT[iMinIndex]
			})
			
			arrT[iMinIndex] += $(this).height() + 10;
		});
	});

	function getMin(){
		var iv = arrT[0];
		var _index = 0;
		for( var i = 1; i < arrT.length; i++) {
			if(arrT[i] < iv) {
				iv = arrT[i];
				_index = i;
			}
		}
		return _index;	
	}
});
}
