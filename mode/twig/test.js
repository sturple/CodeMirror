// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function() {
  var mode = CodeMirror.getMode({tabSize: 4}, 'twig');
  function MT(name) { test.mode(name, mode, Array.prototype.slice.call(arguments, 1)); }
  //comments
  MT("comment",
     "[comment {#]",   
     "[comment <top>This is some text {% if a == b %}{{helloWorld}}{% else %}{% endif %}</top> ]",    
     "[comment #}]"
     );
  
  
  //strings
  MT("string_single_quotes",
     "[tag {%]",
     "[keyword extends]",
     "[string 'layout.twig']",
     "[tag %}]"
    );
  MT("string_double_quotes",
     "[tag {%]",
     "[keyword extends]",
     '[string "layout.twig"]',
     "[tag %}]"
    );  
  
  //filters
  MT("filter_next_to_line",
     "[tag {{]",
     "[variable checkfilter][operator |][variable-2 first]",
     "[tag }}]"
    );
  MT("filter_away_from_line",
     "[tag {{]",
     "[variable checkfilter]",
     "[operator |]",
     "[variable-2 first][bracket (][string 'string'][operator ,][variable myvariable][operator ,][number 23][bracket )]",
     "[tag }}]"
    );
  
  MT("filters_no_params",
     "[tag {{]",
     "[variable users]",
     "[operator |]",  "[variable-2 abs]",
     "[operator |]",  "[variable-2 capitalize]",     
     "[operator |]",  "[variable-2 escape]",      
     "[operator |]",  "[variable-2 e]",        
     "[operator |]",  "[variable-2 first]",        
     "[operator |]",  "[variable-2 join]",  
     "[operator |]",  "[variable-2 keys]", 
     "[operator |]",  "[variable-2 last]", 
     "[operator |]",  "[variable-2 lower]",  
     "[operator |]",  "[variable-2 nl2br]",
     "[operator |]",  "[variable-2 raw]",
     "[operator |]",  "[variable-2 reverse]",
     "[operator |]",  "[variable-2 round]",
     "[operator |]",  "[variable-2 sort]",
     "[operator |]",  "[variable-2 striptags]",
     "[operator |]",  "[variable-2 title]",
     "[operator |]",  "[variable-2 upper]",
     "[operator |]",  "[variable-2 url_encode]",
     "[tag }}]"
    );  
  //keywords
  MT("keywords_in_string_against_tag",
     "[tag {%][keyword set]",
     "[variable msg][operator =][string 'Results not found or anything else'][tag %}]"
  );
  MT("keywords_with_mixed",
     "[tag {%]", 
     "[keyword for]",  
     "[variable article]", 
     "[keyword in]", 
     "[variable articles]", 
     "[keyword if]",  
     "[variable a.active]",  "[keyword and]", "[variable a.color]", "[operator ==]", "[string 'hand']",  
     "[keyword or]",  "[string 'white']","[operator !=]", "[variable and.ifinsomething]",
     "[tag %}]"     
     );
  
  MT("block_title",
     "[tag {%][keyword import] [string 'forms.html'] [keyword as] [variable forms] [tag %}]",     
     "[tag {%] [keyword block] [variable title] [tag %}] Mirror: Twig [tag {%] [keyword endblock] [tag %}]"
    );
  
  MT("functions",
     "[tag {{]", "[variable foobar][bracket (]","[variable foo]","[operator ,]","[string 'bar']", "[bracket )]",  "[tag }}]"     
    ); 


})();
