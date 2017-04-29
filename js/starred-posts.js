( function( $ ){
  $( function(){
    $( '.ino-star-clickable' ).click( function( e ){
      e.preventDefault();
      var $link = $( this ),
          post_id = $link.data( 'post_id' );

      $link.css('opacity', 0.3);

      jQuery.post(
        ajaxurl,
        {
          'action'   : 'ino_set_star',
          'post_id': post_id
        },
        function( result ){
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
