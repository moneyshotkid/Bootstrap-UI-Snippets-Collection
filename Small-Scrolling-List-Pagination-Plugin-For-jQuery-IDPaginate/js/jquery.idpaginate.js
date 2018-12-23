/*!
 * IDPaginate plugin
 * Get it from: http://github.com/indranil/IDPaginate/
 * Copyright (c) 2012 Indranil Dasgupta
 * Version: 0.4.2 (01-JUL-2012)
 * Licensed under the MIT licenses.
 * Requires: jQuery v1.7 or later
 */
(function($) {
	$.fn.idpaginate = function(options) {
		
		var opts = $.extend({}, $.fn.idpaginate.defaults, options);
		
		return this.each(function() {
			
			// lets get the number, the pages, etc...
			this.cont = $(this);
			this.items = this.cont.children();
			this.num = this.items.length;
			this.num_per_page = opts.num;
			
			this.pages = Math.ceil(this.num / this.num_per_page);
			
			this.current_page = 1;
			
			if (this.pages < 2) {
				return;
			} else {
				// we paginate!
				
				// 1. We put a container inside top of the wrap...
				this.cont.wrapInner('<div class="idpaginate-wrapper"></div>');
				this.wrapper = this.cont.find('.idpaginate-wrapper');
				
				// 2. We put in some styles to the wrapper & the container
				this.cont.css({'overflow' : 'hidden', 'position' : 'relative'});
				this.wrapper.css({'position' : 'absolute', 'top' : '0', 'left' : '0'});
				
				// 3. We find out the total height & height of the first page worth of items.
				
				var full_ht = 0;
				this.wrapper.children().each(function() {
					full_ht += $(this).outerHeight(true);
				});
				
				
				var wrap_ht = 0;
				var num_min = this.num_per_page - 1;
				this.wrapper.children().slice(0, num_min).each(function() {
					wrap_ht += $(this).outerHeight(true);
				});
				
				// and apply it to the wrapper & container
				this.cont.css('height', wrap_ht+'px');
				this.wrapper.css('height',full_ht+'px');
				
				// 4. We get the pagination link div
				this.paginate_links = $(opts.pagination_div);
				
				// and fill the pagination links up...
				
				this.paginate_links.html('<a href="#" class="idpaginate-prev idpaginate-prev-disabled">Previous</a>');
				for (i=1;i<=this.pages;i++) {
					dis_link = '';
					if (i==1) {
						dis_link = ' idpaginate-page-current';
					}
					this.paginate_links.append('<a href="#" class="idpaginate-page-link'+dis_link+'">'+i+'</a>');
				}
				this.paginate_links.append('<a href="#" class="idpaginate-next">Next</a>');
				
				// 5. Now, we finally script the click events
				
				// Now, script in the prev and next...
				var total_pgs = this.pages;
				var container = this.cont;
				
				// clicking on the previous button
				this.paginate_links.find('.idpaginate-prev').on('click', function() {
					if ($(this).hasClass('idpaginate-prev-disabled')) {return false;}
					
					// get the current page number
					var curr_pg = Number($(this).parent().find('.idpaginate-page-current').text());
					
					// and trigger the functions
					if (curr_pg == 1) { return false; } else {
						var page_needed = curr_pg - 1;
						bring_page(page_needed, container); // draw up the page that's needed
						redraw_links(page_needed, total_pgs);
						return false;
					}
				});
				
				// clicking on the next button
				this.paginate_links.find('.idpaginate-next').on('click', function() {
					if ($(this).hasClass('idpaginate-next-disabled')) {return false;}
					
					var curr_pg = Number($(this).parent().find('.idpaginate-page-current').text());
					
					if (curr_pg == total_pgs) { return false;} else {
						var page_needed = curr_pg + 1;
						bring_page(page_needed, container);
						redraw_links(page_needed, total_pgs);
						return false;
					}
				});
				
				// clicking on the page numbers
				this.paginate_links.find('.idpaginate-page-link').on('click', function() {
					if ($(this).hasClass('idpaginate-page-current')) {return false;}
					
					// page number
					var curr_pg = Number($(this).parent().find('.idpaginate-page-current').text());
					
					// and trigger!
					var page_needed = Number($(this).text());
					if (curr_pg == page_needed) { return false; } else {
						bring_page(page_needed, container);
						redraw_links(page_needed, total_pgs);
						return false;
					}
				});
				
			} // end if (pages < 2)
			
		});
		
		function redraw_links(page_num, total_pages)
		{
			var p_links = $(opts.pagination_div);
			
			if (page_num == 1) {
				p_links.find('.idpaginate-prev').addClass('idpaginate-prev-disabled');
			} else {
				p_links.find('.idpaginate-prev').removeClass('idpaginate-prev-disabled');
			}
			if (page_num == total_pages) {
				p_links.find('.idpaginate-next').addClass('idpaginate-next-disabled');
			} else {
				p_links.find('.idpaginate-next').removeClass('idpaginate-next-disabled');
			}
			
			// Now, remove the page current class and add it to the current a..
			p_links.find('.idpaginate-page-link').removeClass('idpaginate-page-current');
			p_links.find('.idpaginate-page-link').each(function() {
				if ($(this).text() == page_num) {
					$(this).addClass('idpaginate-page-current');
				}
			});
			
			
		}
		
		function bring_page(page_num, cont)
		{
			var wrapper = cont.find('.idpaginate-wrapper');
			var items = wrapper.children();
			var num = items.length;
			var num_per_page = opts.num;
			
			var pages = Math.ceil(num / num_per_page);
			
			// get the start of the number to be display...
			var start = ((page_num - 1) * num_per_page);
			
			var end = (page_num * num_per_page) - 1;
			if (page_num == pages) {
				end = num;
			}
			
			// let's get the height of the stuff we'll be showing..
			var ht = 0;
			items.slice(start, end).each(function() {
				ht += $(this).outerHeight(true);
			});
			
			// now get the amount it'll have to go up or down...
			var top = 0;
			items.slice(0, start).each(function() {
				top += $(this).outerHeight(true);
			});
			
			anim_speed = opts.speed;
			
			cont.animate({height: ht+'px'}, anim_speed);
			wrapper.animate({top: '-'+top+'px'}, anim_speed);
			
		}
			
	}
	
	$.fn.idpaginate.defaults = {num: 10, pagination_div: '.idpaginate', speed: '2000'};
	
})(jQuery);