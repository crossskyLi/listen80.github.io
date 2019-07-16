! function(document) {
    var space = 'space',
        line = 'line',
        dark = 'dark',
        italic = ' i',
        white = 'white',
        purple = 'purple',
        gold = 'gold',
        red = 'red',
        green = 'green',
        yellow = 'yellow',
        ryan = 'ryan';

    var token, style, cache, match, i, analysis;

    function in_array(value, arr) {
        for (var x = 0, len = arr.length; x < len; x++) {
            if (arr[x] === value) {
                return 1;
            }
        }
    }

    function push() {
        analysis.push([cache, style])
    }

    function isSpace() {
        return token && /[\v\t ]/.test(token)
    }

    function isNewLine() {
        return token === '\n' || token === '\r';
    }

    function isHex() {
        return token && /[0-9A-Fa-f]/.test(token);
    }

    function isNumber() {
        return token && /[0-9]/.test(token)
    }

    function isPunctuation() {
        return "~`!@#$%^&*()-_+=[]{}\\;:'\"|,.<>/?".indexOf(token) !== -1;
    }

    function isLetter() {
        return token && /[a-zA-Z_]/.test(token);
    }

    function isHtmlLetter() {
        return isLetter() || token === '-';
    }

    function isLogistic() {
        return "$!+-=*%&|^<>".indexOf(token) !== -1;
    }

    var keywords = 'break,case,catch,const,continue,debugger,default,delete,do,else,extends,finally,for,if,import,in,instanceof,let,new,return,super,switch,throw,try,typeof,var,void,while,with'.split(',');

    function isKeyword() {
        return in_array(cache, keywords);
    }


    function isConstant() {
        return in_array(cache, ['null', 'true', 'false', 'undefined']);
    }

    var variable = ['var', 'let', 'const'];

    function isVariable() {
        return in_array(cache, variable);
    }

    var parameter = ['self', 'this', 'argument'];

    function isParameter() {
        return in_array(cache, parameter);
    }

    var normal = ['prototype', 'module', 'window', 'document', 'history', 'location', 'screen', 'console', 'Object', 'Array', 'Number', 'Boolean', 'String', 'RegExp', 'Math'];

    function isNormal() {
        return in_array(cache, normal);
    }

    function getHex() {
        style = purple;
        cache = token;
        while (true) {
            token = source[++i];
            if (isHex()) {
                cache += token;
            } else {
                break;
            }
        }
    }

    function getNumber() {
        cache = token;
        while (true) {
            token = source[++i];
            if (isNumber()) {
                cache += token;
            } else if (token === '.') {
                cache += token;
                while (true) {
                    token = source[++i];
                    if (isNumber()) {
                        cache += token;
                    } else {
                        break;
                    }
                }
                break;
            } else {
                break;
            }
        }
    }

    function getWord() {
        cache = token;
        while (true) {
            token = source[++i];
            if (isLetter() || isNumber()) {
                cache += token;
            } else {
                break;
            }
        }
    }

    function getHtmlWord() {
        cache = token;
        while (true) {
            token = source[++i];
            if (isHtmlLetter() || isNumber()) {
                cache += token;
            } else {
                break;
            }
        }
    }

    var tagnames = 'a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,big,blockquote,body,br,button,canvas,caption,center,cite,code,datalist,dd,del,details,dfn,dialog,dir,div,dl,dt,em,embed,fieldset,figcaption,figure,font,footer,form,frame,frameset,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,i,iframe,img,input,ins,kbd,keygen,label,legend,li,link,main,map,mark,nav,object,ol,optgroup,option,p,pre,progress,q,s,samp,script,section,select,small,span,strong,sub,summary,sup,table,tbody,td,textarea,tfoot,th,thead,tr,u,ul,video'.split(',');

    function isTargetName() {
        return in_array(cache, tagnames);
    }

    var cssKeys = 'align-content,align-items,align-self,alignment-baseline,all,animation,animation-delay,animation-direction,animation-duration,animation-fill-mode,animation-iteration-count,animation-name,animation-play-state,animation-timing-function,backface-visibility,background,background-attachment,background-blend-mode,background-clip,background-color,background-image,background-origin,background-position,background-position-x,background-position-y,background-repeat,background-repeat-x,background-repeat-y,background-size,baseline-shift,border,border-bottom,border-bottom-color,border-bottom-left-radius,border-bottom-right-radius,border-bottom-style,border-bottom-width,border-collapse,border-color,border-image,border-image-outset,border-image-repeat,border-image-slice,border-image-source,border-image-width,border-left,border-left-color,border-left-style,border-left-width,border-radius,border-right,border-right-color,border-right-style,border-right-width,border-spacing,border-style,border-top,border-top-color,border-top-left-radius,border-top-right-radius,border-top-style,border-top-width,border-width,bottom,box-shadow,box-sizing,break-after,break-before,break-inside,buffered-rendering,caption-side,clear,clip,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-rendering,column-count,column-fill,column-gap,column-rule,column-rule-color,column-rule-style,column-rule-width,column-span,column-width,columns,contain,content,counter-increment,counter-reset,cursor,cx,cy,d,direction,display,dominant-baseline,empty-cells,fill,fill-opacity,fill-rule,filter,flex,flex-basis,flex-direction,flex-flow,flex-grow,flex-shrink,flex-wrap,float,flood-color,flood-opacity,font,font-family,font-feature-settings,font-kerning,font-size,font-stretch,font-style,font-variant,font-variant-caps,font-variant-ligatures,font-variant-numeric,font-weight,height,hyphens,image-rendering,isolation,justify-content,left,letter-spacing,lighting-color,line-height,list-style,list-style-image,list-style-position,list-style-type,margin,margin-bottom,margin-left,margin-right,margin-top,marker,marker-end,marker-mid,marker-start,mask,mask-type,max-height,max-width,max-zoom,min-height,min-width,min-zoom,mix-blend-mode,motion,object-fit,object-position,offset,offset-distance,offset-path,offset-rotation,opacity,order,orientation,orphans,outline,outline-color,outline-offset,outline-style,outline-width,overflow,overflow-wrap,overflow-x,overflow-y,padding,padding-bottom,padding-left,padding-right,padding-top,page,page-break-after,page-break-before,page-break-inside,paint-order,perspective,perspective-origin,pointer-events,position,quotes,r,resize,right,rx,ry,shape-image-threshold,shape-margin,shape-outside,shape-rendering,size,speak,src,stop-color,stop-opacity,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,tab-size,table-layout,text-align,text-align-last,text-anchor,text-combine-upright,text-decoration,text-indent,text-orientation,text-overflow,text-rendering,text-shadow,text-size-adjust,text-transform,top,touch-action,transform,transform-origin,transform-style,transition,transition-delay,transition-duration,transition-property,transition-timing-function,unicode-bidi,unicode-range,user-select,user-zoom,vector-effect,vertical-align,visibility,webkit-app-region,webkit-appearance,webkit-background-clip,webkit-background-origin,webkit-border-after,webkit-border-after-color,webkit-border-after-style,webkit-border-after-width,webkit-border-before,webkit-border-before-color,webkit-border-before-style,webkit-border-before-width,webkit-border-end,webkit-border-end-color,webkit-border-end-style,webkit-border-end-width,webkit-border-horizontal-spacing,webkit-border-image,webkit-border-start,webkit-border-start-color,webkit-border-start-style,webkit-border-start-width,webkit-border-vertical-spacing,webkit-box-align,webkit-box-decoration-break,webkit-box-direction,webkit-box-flex,webkit-box-flex-group,webkit-box-lines,webkit-box-ordinal-group,webkit-box-orient,webkit-box-pack,webkit-box-reflect,webkit-column-break-after,webkit-column-break-before,webkit-column-break-inside,webkit-font-size-delta,webkit-font-smoothing,webkit-highlight,webkit-hyphenate-character,webkit-line-break,webkit-line-clamp,webkit-locale,webkit-logical-height,webkit-logical-width,webkit-margin-after,webkit-margin-after-collapse,webkit-margin-before,webkit-margin-before-collapse,webkit-margin-bottom-collapse,webkit-margin-collapse,webkit-margin-end,webkit-margin-start,webkit-margin-top-collapse,webkit-mask,webkit-mask-box-image,webkit-mask-box-image-outset,webkit-mask-box-image-repeat,webkit-mask-box-image-slice,webkit-mask-box-image-source,webkit-mask-box-image-width,webkit-mask-clip,webkit-mask-composite,webkit-mask-image,webkit-mask-origin,webkit-mask-position,webkit-mask-position-x,webkit-mask-position-y,webkit-mask-repeat,webkit-mask-repeat-x,webkit-mask-repeat-y,webkit-mask-size,webkit-max-logical-height,webkit-max-logical-width,webkit-min-logical-height,webkit-min-logical-width,webkit-padding-after,webkit-padding-before,webkit-padding-end,webkit-padding-start,webkit-perspective-origin-x,webkit-perspective-origin-y,webkit-print-color-adjust,webkit-rtl-ordering,webkit-ruby-position,webkit-tap-highlight-color,webkit-text-combine,webkit-text-decorations-in-effect,webkit-text-emphasis,webkit-text-emphasis-color,webkit-text-emphasis-position,webkit-text-emphasis-style,webkit-text-fill-color,webkit-text-orientation,webkit-text-security,webkit-text-stroke,webkit-text-stroke-color,webkit-text-stroke-width,webkit-transform-origin-x,webkit-transform-origin-y,webkit-transform-origin-z,webkit-user-drag,webkit-user-modify,webkit-writing-mode,white-space,widows,width,will-change,word-break,word-spacing,word-wrap,writing-mode,x,y,z-index,zoom'.split(',');


    function isCssKey() {
        return in_array(cache.replace(/^-(webkit|moz|ms|o)-/, ''), cssKeys);
    }

    var cssValues = 'red,blue,yellow,green,lime,content-box,border-box,translateX,translateY,translateZ,url,rgba,rgb,whitespace,wait,w-resize,visible,vertical-text,vertical-ideographic,uppercase,upper-roman,upper-alpha,underline,transparent,top,thin,thick,text,text-top,text-bottom,tb-rl,table-header-group,table-footer-group,sw-resize,super,strict,static,square,solid,small-caps,separate,se-resize,scroll,s-resize,rtl,row-resize,ridge,right,repeat,repeat-y,repeat-x,relative,progress,pointer,overline,outside,outset,oblique,nowrap,not-allowed,normal,none,nw-resize,no-repeat,no-drop,newspaper,ne-resize,n-resize,move,middle,medium,ltr,lr-tb,lowercase,lower-roman,lower-alpha,loose,list-item,line,line-through,line-edge,lighter,left,keep-all,justify,italic,inter-word,inter-ideograph,inside,inset,inline,inline-block,inherit,inactive,ideograph-space,ideograph-parenthesis,ideogwhitespace,wait,w-resize,visible,vertical-text,vertical-ideographic,uppercase,upper-roman,upper-alpha,underline,transparent,top,thin,thick,text,text-top,text-bottom,tb-rl,table-header-group,table-footer-group,sw-resize,super,strict,static,square,solid,small-caps,separate,se-resize,scroll,s-resize,rtl,row-resize,ridge,right,repeat,repeat-y,repeat-x,relative,progress,pointer,overline,outside,outset,oblique,nowrap,not-allowed,normal,none,nw-resize,no-repeat,no-drop,newspaper,ne-resize,n-resize,move,middle,medium,ltr,lr-tb,lowercase,lower-roman,lower-alpha,loose,list-item,line,line-through,line-edge,lighter,left,keep-all,justify,italic,inter-word,inter-ideograph,inside,inset,inline,inline-block,inherit,inactive,ideograph-space,ideograph-parenthesis,ideograph-numeric,ideograph-alpha,horizontal,hidden,help,hand,groove,fixed,ellipsis,e-resize,double,dotted,distribute,distribute-space,distribute-letter,distribute-all-lines,disc,disabled,default,decimal,dashed,crosshair,collapse,col-resize,circle,char,center,capitalize,break-word,break-all,bottom,both,bolder,bold,block,bidi-override,below,baseline,auto,always,all-scroll,absolute,table,table-cell-all,bottom,both,bolder,bold,block,bidi-override,below,baseline,auto,always,all-scroll,absolute,table,table-cell,table-row'.split(',');

    function isCssValue() {
        return in_array(cache.replace(/^-(webkit|moz|ms|o)-/, ''), cssValues);
    }

    function handle(style) {
        analysis.push([token, style])
        i++;
    }

    function handleSpace() {
        style = space;
        cache = token;
        while (true) {
            token = source[++i];
            if (isSpace()) {
                cache += token;
            } else {
                push();
                break;
            }
        }
    }

    function hanldeNumber() {
        style = purple;
        cache = token;
        while (true) {
            token = source[++i];
            if (isNumber()) {
                cache += token;
            } else {
                push();
                break;
            }
        }
    }

    function AnalysisForCSSCode() {

        while (true) {
            token = source[i];
            if (!token) {
                break;
            } else if (token === '/' && source[i + 1] === '*') {
                cache = '/*';
                i += 2;

                while (true) {
                    token = source[i];
                    if (!token) {
                        cache && push();
                        break;
                    } else if (token === '*' && source[i + 1] === '/') {
                        cache += '*/';
                        push();
                        i += 2;
                        break;
                    } else if (isNewLine()) {
                        style = dark;
                        cache && push();
                        handle(line);
                        cache = '';
                    } else {
                        cache += token;
                        i++;
                    }
                }
            } else if (token === '.' || token === '#') {
                match = token;
                i++;
                token = source[i];
                if (isHtmlLetter()) {
                    getHtmlWord();
                    style = green;
                    cache = match + cache;
                    push();
                } else {
                    style = white;
                    cache = match;
                    push();
                }
            } else if (token === '[') {
                handle(white);
                while (true) {
                    token = source[i]
                    if (!token || isNewLine()) {
                        break;
                    } else if (token === ']') {
                        handle(white);
                        break;
                    } else if (isHtmlLetter()) {
                        getHtmlWord();
                        style = green;
                        push();
                    } else if (isSpace()) {
                        handleSpace();
                    } else if (token === '=') {
                        handle(red);
                        while (true) {
                            token = source[i];
                            if (!token || isNewLine() || token === ']') {
                                break;
                            } else if (isSpace()) {
                                handleSpace();
                            } else if (token === '"' || token === "'") {
                                match = cache = token;
                                style = yellow;
                                i++;
                                while (true) {
                                    token = source[i]
                                    if (!token || isNewLine()) {
                                        cache && push();
                                        break;
                                    } else if (token === match) {
                                        cache += token;
                                        push();
                                        i++;
                                        break;
                                    } else {
                                        cache += token;
                                        i++;
                                    }
                                }
                            } else if (isHtmlLetter()) {
                                getHtmlWord();
                                style = yellow;
                                push();
                            } else {
                                handle(white);
                            }
                        }
                    } else {
                        cache = token;
                        style = white;
                        push();
                        i++;
                    }
                }
            } else if (isNewLine()) {
                handle(line);
            } else if (token === ':') {
                handle(white);
                while (true) {
                    token = source[i];
                    if (!token) {
                        break;
                    } else if (isSpace()) {
                        handleSpace();
                    } else if (isNewLine()) {
                        handle(line);
                        break;
                    } else if (isNumber() || token === '.') {
                        getNumber();
                        style = purple;
                        push();
                        // hanldeNumber();
                        // px em %
                        if (token === '%') {
                            handle(red);
                        } else if (token === 's') {
                            handle(red);
                        } else if (token === 'p' && source[i + 1] === 'x') {
                            cache = 'px';
                            style = red;
                            push();
                            i += 2;
                        } else if ((token === 'e') && source[i + 1] === 'm') {
                            cache = 'em';
                            style = red;
                            push();
                            i += 2;
                        } else if ((token === 'c') && source[i + 1] === 'm') {
                            cache = 'cm';
                            style = red;
                            push();
                            i += 2;
                        }
                    } else if (isHtmlLetter()) {
                        if (token === '-') {
                            token = source[i + 1];
                            if (isNumber() || token === '.') {
                                token = '-';
                                handle(purple);
                                continue;
                            } else {
                                token = '-';
                            }
                        }
                        getHtmlWord();
                        if (isCssValue()) {
                            style = ryan;
                            push();
                        } else if (cache === 'important') {
                            style = red;
                            push();
                        } else {
                            style = white;
                            push();
                        }
                    } else if (token === ';') {
                        handle(white);
                        break;
                    } else if (token === '#') {
                        cache = match = token;
                        i++;
                        token = source[i];
                        if (isHex()) {
                            getHex();
                            cache = match + cache;
                            style = purple;
                            push();
                        } else {
                            style = white;
                            push();
                            i++;
                        }
                    } else if (token === '#') {
                        cache = match = token;
                        i++;
                        token = source[i];
                        if (isHex()) {
                            getHex();
                            cache = match + cache;
                            style = purple;
                            push();
                        } else {
                            style = white;
                            push();
                            i++;
                        }
                    } else if (token === '!') {
                        handle(red);
                    } else {
                        // ( ) ,
                        handle(white);
                    }
                }
            } else if (isSpace()) {
                handleSpace();
            } else if (isHtmlLetter()) {
                getHtmlWord();
                if (isTargetName()) {
                    style = red;
                    push();
                } else if (isCssKey()) {
                    style = ryan + italic;
                    push();
                } else {
                    style = white;
                    push();
                }
            } else if (token === '*') {
                handle(red);
            } else if (token === '-') {
                handle(purple);
            } else if (token === '@') {
                cache = token;
                style = red;
                i++;
                while (true) {
                    token = source[i];
                    if (!token || isNewLine()) {
                        cache && push();
                        break;
                    } else if (token === '{') {
                        push();
                        break;
                    } else {
                        cache += token;
                        i++;
                    }
                }
            } else {
                handle(white);
            }
        }

        return analysis;
    }

    function AnalysisForMarkupCode() {

        function handleWord() {
            // tag attribute (name) = value
            style = green;
            cache = token;
            while (token = source[++i]) {
                if (isHtmlLetter() || isNumber()) {
                    cache += token;
                } else {
                    push();
                    break;
                }
            }

            while (true) {
                token = source[i];
                if (isNewLine()) {
                    handle(line);
                } else if (isSpace()) {
                    handleSpace()
                } else {
                    break;
                }
            }

            if (token === '=') {
                cache = token;
                // tag attribute name (=) value
                style = white;
                i++;
                push();

                if (isSpace()) {
                    handleSpace()
                }
                token = source[i];
                if (token === '"' || token === "'") {
                    // attribute value
                    style = yellow;
                    match = cache = token;
                    while (token = source[++i]) {
                        if (token === match) {
                            cache += token;
                            push();
                            i++;
                            break;
                        } else if (isNewLine()) {
                            push();
                            style = line;
                            cache = token;
                            i++;
                            push()
                        } else {
                            cache += token;
                        }
                    }
                } else {
                    if (!(!token || isNewLine() || token === '>')) {
                        style = yellow;
                        cache = token;
                        while (true) {
                            token = source[++i];
                            if (!token || isNewLine() || token === '>' || token === ' ') {
                                push();
                                break;
                            } else {
                                cache += token;
                            }
                        }
                    }
                }
            }
        }

        function handleInnerTag() {
            var endIndex = source.indexOf('</' + matchTag + '>', i);
            if (endIndex !== -1 && endIndex > i) {
                var preSource = source;
                source = source.substring(i, endIndex);
                i = 0;
                if (matchTag === 'style') {
                    AnalysisForCSSCode();
                } else {
                    AnalysisForSourceCode();
                }
                source = preSource;
                i = endIndex;
            }
        }

        var matchTag = '';
        var isEndTag = 0;
        while (true) {
            token = source[i]
            if (!token) {
                break;
            } else if (token === '<') {
                if (source[i + 1] === '!') {
                    if (source[i + 2] === '-' && source[i + 3] === '-') {
                        cache = '<!--';
                        style = dark;
                        i += 4;
                        while (true) {
                            token = source[i]
                            if (!token) {
                                cache && push();
                            } else if (token === '-' && source[i + 1] === '-' && source[i + 2] === '>') {
                                cache += '-->';
                                push();
                                i += 3;
                                break;
                            } else if (isNewLine()) {
                                cache && push();
                                handle(line);
                                cache = '';
                            } else {
                                cache += token;
                                i++;
                            }
                        }
                        continue;
                    }
                }

                handle(white);
                token = source[i]

                if (token === '!' || token === '?') {
                    handle(white);
                } else if (token === '/') {
                    handle(white);
                    isEndTag = 1;
                } else {
                    isEndTag = 0;
                }

                token = source[i]
                if (isHtmlLetter()) {
                    // tag name
                    getHtmlWord();
                    if (isEndTag) {
                        matchTag = '';
                    } else {
                        matchTag = cache;
                    }
                    style = red;
                    push();
                    while (token = source[i]) {
                        if (token === '>') {
                            // tag end
                            handle(white);
                            if (matchTag === 'script' || matchTag === 'style') {
                                handleInnerTag()
                            }
                            break;
                        } else if (isSpace()) {
                            handleSpace();
                        } else if (token === '"' || token === "'") {
                            // attribute value
                            style = yellow;
                            cache = match = token;
                            while (token = source[++i]) {
                                if (token === match) {
                                    cache += token;
                                    i++;
                                    push();
                                    break;
                                } else {
                                    cache += token;
                                }
                            }
                        } else if (isHtmlLetter() || isNumber()) {
                            // tag inner word
                            handleWord();
                        } else if (isPunctuation()) {
                            // for 
                            handle(white);
                        } else if (isNewLine()) {
                            handle(line);
                        } else {
                            handle('fail');
                        }
                    }
                }
            } else if (isNewLine()) {
                handle(line);
            } else if (isSpace()) {
                handleSpace();
            } else {
                // inner html
                style = white;
                cache = token;
                while (true) {
                    token = source[++i]
                    if (!token || isNewLine() || token === '<') {
                        push();
                        break;
                    } else {
                        cache += token;
                    }
                }
            }
        }
        return analysis;
    }

    function AnalysisForSourceCode() {

        function isRegExp() {
            var _i;
            if (token === '/') {
                _i = i;
                while (true) {
                    token = source[--_i];
                    if (isSpace()) {
                        continue;
                    } else if (token === '=' || token === ':' || token === '(' || token === '|' || token === '?' || isNewLine() || !token) {
                        _i = i
                        while (token = source[++_i]) {
                            if (isNewLine() || !token) {
                                break;
                            } else if (token === '\\') {
                                _i++;
                                continue
                            } else if (token === "/") {
                                return 1;
                            } else {
                                continue;
                            }
                        }
                        break;
                    } else {
                        break;
                    }
                }
            }
        }

        function handlePunctuation() {
            if (token === '/' && source[i + 1] === '*') {
                cache = '/*';
                i += 2;

                while (true) {
                    token = source[i];
                    if (!token) {
                        cache && push();
                        break;
                    } else if (token === '*' && source[i + 1] === '/') {
                        cache += '*/';
                        push();
                        i += 2;
                        break;
                    } else if (isNewLine()) {
                        style = dark;
                        cache && push();
                        handle(line);
                        cache = '';
                    } else {
                        cache += token;
                        i++;
                    }
                }
            } else if (token === '/' && source[i + 1] === '/') {
                cache = '//', i++;
                style = dark;
                while (true) {
                    token = source[++i];
                    if (!token) {
                        push();
                        break;
                    } else if (isNewLine()) {
                        push();
                        cache = token;
                        style = line;
                        push();
                        break;
                    } else {
                        cache += token;
                    }
                }
                i++;
            } else if (token === "'" || token === '"') {
                match = cache = token;
                while (true) {
                    token = source[++i];
                    if (!token || isNewLine()) {
                        cache && push();
                        break;
                    } else if (token === '\\') {
                        style = yellow;
                        push();
                        cache = token + source[++i];
                        style = purple;
                        push();
                        cache = '';
                    } else if (token === match) {
                        cache += token;
                        style = yellow;
                        push();
                        break;
                    } else {
                        cache += token;
                    }
                }
                i++;
            } else if (token === '/' || isLogistic()) {
                match = isRegExp();
                if (match === 1) {
                    cache = '/';
                    style = 'yellow hehe';
                    push();
                    i++;
                    while (true) {
                        token = source[i];
                        if (!token || isNewLine()) {
                            cache && push();
                        } else if (token === '\\') {
                            style = purple;
                            cache = token + source[++i];
                            push();
                            i++;
                        } else if (token === "/") {
                            style = yellow;
                            cache = token;
                            push();
                            i++;
                            cache = '';
                            while (token = source[i]) {
                                if (~'gi'.indexOf(token)) {
                                    style = red;
                                    cache += token;
                                    i++;
                                } else {
                                    break;
                                }
                            }
                            cache && push();
                            break;
                        } else if (isLogistic()) {
                            handle(red);
                        } else if (isLetter()) {
                            style = yellow;
                            getWord();
                            push();
                            cache = '';
                        } else {
                            handle(yellow);
                        }
                    }
                } else {
                    // logic
                    style = red;
                    cache = source[i];
                    while (token = source[++i]) {
                        if (isLogistic()) {
                            cache += token;
                        } else {
                            push();
                            break;
                        }
                    }
                }
            } else {
                handle(white);
            }

        }

        function handleNumberAndHex() {
            style = purple;
            cache = token;
            if (token === '0' && (source[i + 1] === 'x' || source[i + 1] === 'X')) {
                // oxabc十六进制
                cache += source[++i];
                while (true) {
                    token = source[++i];
                    if (isHex()) {
                        cache += token;
                    } else {
                        push();
                        break;
                    }
                }
            } else {
                hanldeNumber()
            }
        }

        function handleFunction() {
            var len = analysis.length - 1;
            if(len > -1) {
                token = analysis[len][0][0];
                if (isSpace()) {
                    len--;
                    token = analysis[len][0][0];
                }
                if (token === ':' || token === '=') {
                    len--;
                    token = analysis[len][0][0];
                    if (isSpace()) {
                        len--;
                        token = analysis[len][0][0];
                    }
                    if (isLetter()) {
                        analysis[len][1] = 'green';
                    }
                }
            }
            token = source[i];
            cache = 'function';
            style = ryan + italic;
            push();
        }


        while (true) {
            token = source[i];
            if (!token) {
                break;
            } else if (isSpace()) {
                handleSpace();
            } else if (isNewLine()) {
                handle(line);
            } else if (isNumber()) {
                handleNumberAndHex();
            } else if (isLetter()) {
                getWord();
                if (cache === 'function') {
                    handleFunction();
                    if (isSpace()) {
                        handleSpace();
                    }
                    if (isLetter()) {
                        getWord();
                        style = green;
                        push();
                        if (isSpace()) {
                            handleSpace();
                        }
                    }
                    if (token === '(') {
                        handle(white)
                        while (true) {
                            token = source[i];
                            if (isSpace()) {
                                handleSpace();
                            } else if (token === ',') {
                                handle(white)
                            } else if (isLetter()) {
                                getWord();
                                style = gold + italic;
                                push();
                            } else {
                                break;
                            }
                        }
                    }
                } else {
                    if (isVariable()) {
                        style = ryan + italic;
                    } else if (isKeyword()) {
                        style = red;
                    } else if (isParameter()) {
                        style = gold + italic;
                    } else if (isNormal()) {
                        style = ryan;
                    } else if (isConstant()) {
                        style = purple;
                    } else {
                        style = white;

                        if (token === '(') {
                            style = ryan;
                        } else if (isSpace()) {
                            while (true) {
                                token = source[i + 1];
                                if (isSpace()) {
                                    handleSpace();
                                } else if (token === '(') {
                                    style = ryan;
                                    break;
                                } else {
                                    break;
                                }
                            }
                        }
                    }
                    push();
                }
            } else if (isPunctuation()) {
                handlePunctuation();
            } else {
                handle('fail');
            }
        }
        return analysis;
    }

    function AnalysisFor(s, indent) {
        source = s;
        if(indent) {
            var reg = new RegExp('^\\s{' + indent + '}')
            source = source.split(/\n|\r|(?:\r\n)/).map(function(v) {
               return  v.replace(reg, '')
            }).join('\n');
        }
        i = 0, analysis = [];
        return /^\s*</.test(source) ? AnalysisForMarkupCode() : AnalysisForSourceCode()
    }

    function AnalysisForElement(script) {
        if (!script.coded) {
            script.coded = true;
            var firstChild = script.firstChild;
            if (firstChild) {
                var codes = AnalysisFor(firstChild.nodeValue.replace(/^\s+|\s+$/g, ""), script.getAttribute('code'));
                var ol = document.createElement('ol');
                var li = document.createElement('li');
                var count = 0;
                for (var x = 0, len = codes.length; x < len; x++) {
                    var code = codes[x];
                    var span = document.createElement('span');
                    span.appendChild(document.createTextNode(code[0]));
                    span.className = code[1];
                    if (span.className === 'line') {
                        ol.appendChild(li);
                        li = document.createElement('li');
                        count++;
                    } else {
                        li.appendChild(span);
                    }
                }
                ol.style.paddingLeft = String(count).length / 2 + 1.3 + 'em';
                ol.appendChild(li);
                script.replaceChild(ol, firstChild);
                script.style.display = 'block';
            }
        }
    }

    function AnalysisForTagName(tagname) {
        var scripts = document.getElementsByTagName(tagname);
        for (var k = 0, len = scripts.length; k < len; k++) {
            var script = scripts[k];
            script.hasAttribute('code') && AnalysisForElement(script);
        }
    }

    function code(element, indent) {
        if (!element) {
            AnalysisForTagName('xmp');
            AnalysisForTagName('script');
        } else {
            if (element instanceof Node) {
                element.setAttribute('code', ''), AnalysisForElement(element);
            } else {
                return AnalysisFor(element.toString(), indent);
            }
        }
    }

    if (typeof module !== 'undefined') {
        module.exports = code;
    } else {
        this.code = code;
    }

    document && setTimeout(code);

}(this.document)