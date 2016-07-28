// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"),   require("../htmlmixed/htmlmixed"),require("../../addon/mode/overlay"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "../htmlmixed/htmlmixed","../../addon/mode/overlay"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";    
  
   CodeMirror.defineMode("twig:inner", function(config) {  
    var keywords = ["and", "as", "autoescape", "endautoescape", "block", "do", "endblock", "else", "elseif", "extends", "for", "endfor", "embed", "endembed", "filter", "endfilter", "flush", "from", "if", "endif", "in", "is", "include", "import", "not", "or", "set", "spaceless", "endspaceless", "with", "endwith", "trans", "endtrans", "blocktrans", "endblocktrans", "macro", "endmacro", "use", "verbatim", "endverbatim"],
        operator = /^[+\-*&%=<>\,!?|~^]/,
        bracket = /^[\(\)]/,
        sign = /^[:\[\(\{]/,
        atom = ["true", "false", "null", "empty", "defined", "divisibleby", "divisible by", "even", "odd", "iterable", "sameas", "same as"],
        number = /^(\d[+\-\*\/])?\d+(\.\d+)?/,
        filters = ['abs','batch','capitalize','convert_encoding','date','date_modify','default','e','escape','first','format','join','json_encode','keys','last','length','lower','merge','nl2br','number_format','raw','replace','reverse','round','slice','sort','split','striptags','title','trim','upper','url_encode'];
        
        filters = new RegExp("\\b((" + filters.join(")|(") + "))\\b");    
        keywords = new RegExp("\\b((" + keywords.join(")|(") + "))\\b");
        atom = new RegExp("\\b((" + atom.join(")|(") + "))\\b");
     
        console.log(keywords);
    function dispatch(stream, state) {
    var ch = stream.peek();

      //Comment
      if (state.incomment) {        
        if (!stream.skipTo("#}")) { 
          stream.skipToEnd(); 
        } 
        else {
          stream.eatWhile(/\#|}/);
          state.incomment = false;
        }
        return "comment";      
      } 
      
      //Inside Tag
      else if (state.intag) {
        
        //in string
        if (stream.match(/(("(.*?)")|('(.*?)'))/)){          
          return 'string';
        }      
        
        //After operator
        if (state.operator) {
          // this fixes filter |filterAWorked and | filterBNotWorked
          stream.eatWhile(/\s+/);
          state.operator = false;
          if (stream.match(atom))                     { return "atom";}
          if (stream.match(number))                   { return "number";}
          if (stream.match(filters))                  { return "variable-2";}
          if (stream.match(/(("(.*?)")|('(.*?)'))/))  { return 'string';  }    
        }
        //After sign
        if (state.sign) {
          state.sign = false;
          if (stream.match(atom))   {return "atom";}
          if (stream.match(number)) {return "number";}
        }

        else if (stream.match(state.intag + "}") || stream.eat("-") && stream.match(state.intag + "}")) {
          state.intag = false;          
          return "tag";
        } 
        else if (stream.match(operator)) {
          state.operator = true;
          return "operator";
        } 
        else if (stream.match(bracket))  {return "bracket";}
        
        else if (stream.match(sign)) {
          state.sign = true;
        } 
        else {
          
          
          if (stream.eat(/\s|\{|\%/) || stream.sol() ) {         
            
            if (stream.match(keywords)) {return "keyword";}
            if (stream.match(atom))     {return "atom";}
            if (stream.match(number))   {return "number";}
            if (stream.sol())           { stream.next();}
          }
          // this is used to catch keywords next to tags
          
          else if ((state.intag.match(/\{|\%/)) && (!state.invariable) ){
            if ( (stream.match(keywords))) {return "keyword";}   
            stream.next();
          }
                   
          else {         
            if (stream.eatSpace()){
              return null;
            }
            state.invariable = false
            stream.next();
          }
        }       
        state.invariable = true;
        return "variable";
      } 
      else if (stream.eat("{")) {
        if (ch = stream.eat("#")) {
          state.incomment = true;
          if (!stream.skipTo("#}")) {
            stream.skipToEnd();
          } else {
            stream.eatWhile(/\#|}/);
            state.incomment = false;
          }
          return "comment";
        
        } 
        //Open tag
        else if (ch = stream.eat(/\{|%/)) {
          //Cache close tag
          state.intag = ch;
          if (ch == "{") {
            state.intag = "}";
            
          }
          stream.eat("-");
          return "tag";
        }
      }
      state.invariable = false;
      stream.next();
          

    };      
    return {
      startState: function() {              
        return {
                   
          indented: 4,
          previousToken: { style: null, indented:  0},
          tokenize: dispatch
         };
      },

      copyState: function(state) {
        return {              
          indented: state.indented,
          previousToken : state.previousToken,
          tokenize : state.tokenize
        }

      },

      token: function(stream,state) {      
        var disp =  dispatch(stream, state);       
        return disp;
      },
      blockCommentStart: "{#",
      blockCommentEnd: "#}"
    };
  }); 
    
  CodeMirror.defineMode("twig", function(config) {
    var htmlBase = CodeMirror.getMode(config, "text/html");
    var twigInner = CodeMirror.getMode(config, "twig:inner");
    return CodeMirror.overlayMode(htmlBase, twigInner);
  });
  CodeMirror.defineMIME("text/x-twig", "twig");
});
