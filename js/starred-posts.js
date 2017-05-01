( function( $ ){
  var stars_ids;
  var star_queue={};

  $( function(){
    $( '.ino-star-clickable' ).click( function( e ){
      e.preventDefault();
      var $link = $( this ),
          post_id = $link.data( 'post_id' );

      $link.css('opacity', 0.3);

      var queue_id = 'post_' + post_id;

      if( star_queue[ queue_id ] ){
        star_queue[ queue_id ].abort();
      }

      star_queue[ queue_id ] = $.post(
        ajaxurl,
        {
          'action'   : 'ino_set_star',
          'post_id': post_id
        },
        function( result ){
          star_queue[ queue_id ] = null;

          if( typeof result.val !== 'undefined' ){
            $link.attr( 'class', 'ino-star c'+result.val );

            if( result.label ){
              $link.attr( 'title', 'starred with \'' + result.label + '\'' )
            }else{
              $link.attr( 'title', '');
            }
          }

          $link.css('opacity', 0.99);;
        },
        'json'
      );
    } );
  } );
} )( jQuery );
