// Author:
//  Farhan Saqib ==> farhan.saqib@yandex.com


;(function($) {

    var pluginName	= 'vidGallery',
        dataKey 	= 'plugin_' + pluginName,
        defaults	= {
            galleryMainClass:	'gallery-main',
            galleryItemsClass:	'gallery-items',
            galleryItemClass:	'gallery-item',
            galleryTitleText: 	'Related Videos',
            // Valid sizes: default (default), medium (mqdefault),
            // high (hqdefault), standard (sqdefault), max (maxresdefault)
            thumbSize: 			'default'
        };

    function Plugin (element, options) {

        this.element 	= element;
        this.$element 	= $(element);
        this.options 	= $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init(options);

    }

    Plugin.prototype = {

        init: function () {

            this._getVideos();
            this._getMainVid();
            this._getEvents();

            return this;

        },
        _getVideos: function () {

            var self			= this,
                thumbSize 		= self.options.thumbSize;

            videoList = [];

            switch ( thumbSize ) {

                case 'default':
                    thumbSize = 'mqdefault.jpg';
                    break;
                case 'mqdefault':
                case 'medium':
                    thumbSize = 'mqdefault.jpg';
                    break;
                case 'hqdefault':
                case 'high':
                    thumbSize = 'hqdefault.jpg';
                    break;
                case 'sddefault':
                case 'standard':
                    thumbSize = 'sddefault.jpg';
                    break;
                case 'maxresdefault':
                case 'max':
                    thumbSize = 'maxresdefault.jpg';
                    break;
                default:
                    throw new Error( '`' + self.options.thumbSize + '`' + ' is not a valid thumbnail size. Valid sizes: default (default), medium (mqdefault), high (hqdefault), standard (sqdefault), max (maxresdefault)');

            }

            $('.' + self.options.galleryItemClass).each(function (index) {

                var $vidLink = $(this).find('a'),
                    listItem = [],
                    text = $(this).data('type') === 'youtube' ? 'v=' : 'video/';

                videoList.push({
                    reference: this,
                    videoId: $vidLink.attr('href').split(text)[1],
                    vidDesc: $vidLink.text(),
                    type: $(this).data('type')
                });
                var thumbnailUrl = '';
                if (text === 'v=') {
                    thumbnailUrl = 'http://i.ytimg.com/vi/' + videoList[index].videoId + '/' + thumbSize;
                } else {
                    $.getJSON('https://vimeo.com/api/v2/video/' + videoList[index].videoId + '.json', function(data) {
                        $('img#' + videoList[index].videoId).attr('src', data[0].thumbnail_medium);
                    });
                }
                $vidLink.html('');

                listItem 	+= '<div class=\"media media-left\">';
                listItem 	+= 		'<div class=\"media-img gallery-item-thumb\">';
                listItem 	+=			'<img id="'+videoList[index].videoId+'" src=\"' + thumbnailUrl + '"/>';
                listItem	+= 		'</div>';
                listItem	+= 		'<div class=\"media-body gallery-item-desc\">';
                listItem	+= 			videoList[index].vidDesc;
                listItem	+= 		'</div>';
                listItem	+= 	'</div>';

                console.log(listItem);

                $vidLink.append(listItem);

            });

        },
        _getMainVid: function () {

            var self 		= this,
                mainVid		= [],
                url = videoList[0].type === 'youtube'
                    ? 'www.youtube.com/embed/' + videoList[0].videoId + '?rel=0'
                    : 'player.vimeo.com/video/' + videoList[0].videoId;

            mainVid 	+= '<div class=\"' + self.options.galleryMainClass + '\">';
            mainVid 	+= 		'<div class=\"flex-media\">';
            mainVid 	+= 			'<iframe src=\"https://' + url + '\" seamless>';
            mainVid		+= 		'</div>';
            mainVid 	+= '</div>';

            $('.gallery').prepend(mainVid);
            $('.' + self.options.galleryItemClass).eq(0).addClass('active');

        },
        _getEvents: function () {

            var self = this;

            $('.' + self.options.galleryItemClass).on('click', function (e) {

                e.preventDefault();

                var $iframe			= $('.' + self.options.galleryMainClass).find('iframe'),
                    currentIndex	= $(this).index(),
                    newSrc = videoList[currentIndex].type === 'youtube'
                        ? 'https://www.youtube.com/embed/' + videoList[currentIndex].videoId + '?rel=0'
                        : 'https://player.vimeo.com/video/' + videoList[currentIndex].videoId;


                if ( !$(this).hasClass('active') ) {

                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    $iframe.attr('src', newSrc);

                }

            });

        }
    };

    $.fn[pluginName] = function (options) {

        var plugin = this.data(dataKey);

        if ( plugin instanceof Plugin ) {
            if (typeof options !== 'undefined') {
                plugin.init(options);
            }
        } else{
            plugin = new Plugin(this, options);
            this.data(dataKey, plugin);
        }

        return plugin;

    };

})(jQuery);


$(function() {

    $('.gallery').vidGallery();

    $('.vid-popup').magnificPopup({
        type: 'inline',
        preloader: false,
        showCloseBtn: true,
        mainClass: 'mfp-active',
        removalDelay: 300
    });

});