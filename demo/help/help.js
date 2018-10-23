(function() {
    function AnalysisCss(css) {
        var cssObj = [];
        var matched = css.match(/^(\w+)?((?:\.\w+){0,})(\#\w+)?(\[\s*\w+\s*(?:=\s*\w+\s*)?\])?(:\w+)?$/)
        if (matched) {
            matched.splice(0, 1)
            cssObj[0] = matched[0] || '*'
            if (matched[1]) {
                cssObj[1] = map(matched[1].substr(1).split('.'), function(className) {
                    return new RegExp("(?:\\s|^)" + className + "(?:\\s|$)");
                })
            }
            if (matched[2]) {
                cssObj[2] = { id: matched[2].substr(1) }
            }
            if (matched[3]) {
                cssObj[2] = cssObj[2] || {};
                var attributes = matched[3].match(/\[\s*(\w+)\s*=\s*(\w+)\s*?\]/).slice(1);
                cssObj[2][attributes[0]] = attributes[1];
            }
            if (matched[4]) {
                cssObj[3] = matched[4].substr(1);
            }
        } else {
            throw new Error('unknow css selector')
        }
        return cssObj
    }

    function checkElementCss(element, css) {
        if (css[0] !== '*' && css[0] !== element.nodeName.toLowerCase()) return;
        if (css[1] && !every(css[1], function(className) {
                return className.test(element.className)
            })) {
            return
        }
        if (css[2] && !every(css[2], function(attrValue, attrName) {
                return attrValue == null ? element.hasAttribute(attrName) : element.getAttribute(attrName) === attrValue;
            })) {
            return
        }
        if (css[3] && !(element[css[3]] === true)) return
        return true;
    }

    function checkElementCssChain(element, css, last) {
        var i = 0,
            len = css.length;
        while (element && element !== last) {
            if (checkElementCss(element, css[i])) {
                if (++i === len) {
                    return true;
                }
            } else {
                if (i === 0) {
                    return false;
                }
            }
            element = element.parentNode;
        }
    }

    function arrayIndex(arr, value) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === value) {
                return i
            }
        }
        return -1;
    }

    function querySelectorAll(css, parents) {
        var elements = [];
        parents = parents || [document];
        if (false && document.querySelectorAll) {
            each(parents, function(parent) {
                each(parent.querySelectorAll(css), function(element) {
                    elements.push(element)
                })
            });
        } else {
            each(css.split(','), function(css) {
                css = trim(css).split(/\s+/).reverse();
                for (var i = 0, len = css.length; i < len; i++) {
                    css[i] = AnalysisCss(css[i])
                }
                each(parents, function(parent) {
                    var all = parent.getElementsByTagName(css[0][0]);
                    for (var x = 0, len = all.length; x < len; x++) {
                        var now = all[x];
                        arrayIndex(elements, now) === -1 && checkElementCssChain(now, css, parent) && elements.push(now);
                    }
                })
            })
        }
        return elements;
    }

    function $(selector) {

        if (selector == null) {
            selector = [];
        } else if (selector[0] === '<') {
            selector = parseHTML(selector);
        } else if (typeof selector === 'object') {
            selector = [selector]
        } else if (typeof selector === 'string') {
            selector = querySelectorAll(selector)
        } else if (typeof selector === 'function') {
            return document.readyState === "complete" ? selector($) : $(document).on('DOMContentLoaded', selector);
        }
        return new HTMLCollection(selector)
    }

    function each(obj, fn) {
        if (typeof obj.length === 'number') {
            for (var i = 0, len = obj.length; i < len; i++) {
                if (fn.call(obj[i], obj[i], i, obj) === false) {
                    break;
                }
            }
        } else {
            for (var i in obj) {
                if (obj.hasOwnProperty(i) && fn.call(obj[i], obj[i], i, obj) === false) {
                    break;
                }
            }
        }
        return obj;
    }

    function map(obj, fn) {
        var clone = {};
        for (var x in obj) {
            if (obj.hasOwnProperty(x)) {
                clone[x] = fn.call(obj[x], obj[x], x, obj);
            }
        }
        return clone;
    }

    function filter(obj, fn) {
        var clone = [];
        for (var x in obj) {
            if (obj.hasOwnProperty(x)) {
                fn.call(obj[x], obj[x], x, obj) && clone.push(obj[x]);
            }
        }
        return clone;
    }

    function every(obj, fn) {
        for (var x in obj) {
            if (obj.hasOwnProperty(x) && fn.call(obj[x], obj[x], x, obj) === false) {
                return false;
            }
        }
        return true;
    }

    function some(obj, fn) {
        for (var x in obj) {
            if (obj.hasOwnProperty(x) && fn.call(obj[x], obj[x], x, obj) === true) {
                return true;
            }
        }
        return false;
    }

    function type(obj) {
        return Object.prototype.toString.call(obj).replace(/^\[object |\]$/g, '').toLowerCase();
    }

    function isNull(obj) {
        return obj === null;
    }

    function isUndef(obj) {
        return obj === undefined;
    }

    function json(obj) {
        if (typeof obj === 'object') {
            return JSON.stringify(obj);
        } else if (typeof obj === 'string') {
            return JSON.parse(obj);
        } else {
            return obj;
        }
    }

    function addEventListener(element, type, back) {
        element.addEventListener(type, back)
    }

    function trim(str) {
        return (str + '').replace(/^\s+|\s+$/g, '');
    }

    function HTMLCollection(source) {
        for (var x = 0, len = source.length; x < len; x++) {
            this[x] = source[x]
        }
        this.length = len;
        return this
    }

    function parseHTML(html) {
        var element = document.createElement('div');
        element.innerHTML = html;
        return element.children;
    }

    HTMLCollection.prototype = {
        pop: [].pop,
        push: [].push,
        sort: [].sort,
        splice: [].splice,
        slice: [].slice,
        each: function(fn) {
            return each(this, fn)
        },
        map: function(fn) {
            return map(this, fn);
        },
        hasClass: function(className) {
            return className == null ? !!this[0].className : this[0] ? RegExp("\\b" + className + "\\b").test(this[0].className) : false;
        },
        addClass: function(className) {
            var reg = RegExp("\\b" + className + "\\b");
            return this.each(function(element) {
                if (!reg.test(element.className)) {
                    element.className = trim((element.className + " " + className).replace(/\s+/, ' '));
                }
            })
        },
        removeClass: function(className) {
            if (null == className) {
                return this.each(function(element) {
                    element.className = '';
                })
            } else {
                var reg = RegExp("\\b" + className + "\\b");
                return this.each(function(element) {
                    element.className = trim(element.className.replace(reg, '').trim().replace(/\s+/, ' '));
                })
            }
        },
        html: function(html) {
            return html == null ?
                this.map(function(element) {
                    return element.innerHTML;
                }) + '' :
                this.each(function(element) {
                    element.innerHTML = html;
                })
        },
        attr: function(attrName, attrValue) {
            return attrName == null ? this[0].attributes :
                attrValue == null ? this[0].getAttribute(attrName) : this.each(function(element) {
                    element.setAttribute(attrName, attrValue);
                })
        },
        removeAttr: function(attrName) {
            return this.each(function(element) {
                element.removeAttribute(attrName);
            })
        },
        prop: function(propName, propValue) {
            return propValue == null ? this[0][propName] : this[0][propName] = propValue;
        },
        val: function(value) {
            return value == null ? this[0].value : this.each(function(element) {
                element.value = value;
            })
        },
        empty: function() {
            return this.each(function(element) {
                element.innerHTML = '';
            })
        },
        remove: function() {
            return this.each(function(element) {
                element.parentNode.removeChild(element);
            })
        },
        css: function(cssName, cssValue) {
            var cssObj = {};
            if (cssName == null) {
                return this;
            } else if (typeof cssName === 'object') {
                cssObj = cssName
            } else if (!cssValue) {
                return this[0].style[cssName];
            } else {
                cssObj[cssName] = cssValue;
            }
            return this.each(function(element) {
                each(cssObj, function(cssValue, cssName) {
                    element.style[cssName.replace(/-([a-z])/g, function(match, letter) {
                        return letter.toUpperCase();
                    })] = cssValue;
                })
            })
        },
        find: function(selector) {
            return new HTMLCollection(querySelectorAll(selector, this))
        },
        on: function(type, css, callback) {
            var simple;
            if (typeof css === 'function') {
                simple = true;
                callback = css;
            } else {
                css = trim(css).split(/\s+/).reverse();
                for (var i = 0, len = css.length; i < len; i++) {
                    css[i] = AnalysisCss(css[i])
                }
            }
            return this.each(function(element) {
                addEventListener(element, type, function(e) {
                    if (simple) {
                        callback.call(element, e);
                    } else {
                        e = e || event;
                        target = e.target || e.srcElement;
                        while (target && element !== target) {
                            checkElementCssChain(target, css, element) && callback.call(element, e, target)
                            target = target.parentNode;
                        }
                    }
                })
            })
        },
        before: function(text) {
            if (typeof text === 'object') {

            } else {

            }
            return this.each(function(element) {
                element.parentNode.insertBefore(createTextNode(text), element);
            })
        },
        after: function(text) {
            return this.each(function(element) {
                element.parentNode.insertBefore(createTextNode(text), element.nextSibling);
            })
        },
        append: function(text) {
            var element = this[0]
            text.each(function(e) {
                element.insertBefore(e, null)
            })
            // return this.each(function(element) {
            //     element.insertBefore(createTextNode(text), null);
            // })

            return this;
        },
        prepend: function(text) {
            return this.each(function(element) {
                element.insertBefore(createTextNode(text), element.firstChild);
            })
        },
        eq: function(index) {
            index = index < 0 ? index + this.length : index;
            return new HTMLCollection([this[index]]);
        },
        cssText: function(cssText) {
            return this.each(function(element) {
                cssText == null ?
                    element.style.cssText = '' :
                    element.style.cssText += ";" + cssText;
            })
        },
        appendTo: function(cssSelector) {
            var dist = $(cssSelector)[0];
            if (dist) {
                each(this, function(element) {
                    dist.appendChild(element)
                })
            }


            return this;
        },
        then: function(fn) {
            fn && fn.call(this, this);
            return this;
        },
        children: function() {
            var collect = [];
            this.each(function(parent) {
                if (parent.children) {
                    $.each(parent.children, function(child) {
                        collect.push(child);
                    })
                }
            })
            return new HTMLCollection(collect)
        },
        next: function() {
            var collect = [];
            this.each(function(element) {
                while (element.nextSibling) {
                    if (element.nextSibling.nodeType === 1) {
                        collect.push(element.nextSibling);
                        break;
                    }
                    element = element.nextSibling;
                }

            })
            return new HTMLCollection(collect)
        },
        index: function() {
            var el = this[0];
            var children = el.parentNode.children;
            for (var i = 0, len = children.length; i < len; i++) {
                if (el === children[i]) {
                    return i;
                }
            }
            return -1;
        },
        parent: function() {
            var collect = [];
            this.each(function(element) {
                if (element.parentNode) {
                    collect.push(element.parentNode);
                }

            })
            return new HTMLCollection(collect)
        }
    }

    $.parseHTML = function(html, wrap) {
        var div = document.createElement('div');
        div.innerHTML = html;
        var fragment = document.createDocumentFragment();
        if (wrap) {
            while (div.firstChild) {
                fragment.appendChild(div.firstChild);
            }
            return fragment
        }
        console.log(div)
        return div.childNodes;
    }

    function createTextNode(text) {
        var textNode = document.createTextNode('text');
        textNode.nodeValue = text;
        return textNode;
    }

    $.each = each;
    $.type = type;
    $.json = json;

    function get(data) {
        var arr = [];
        each(data, function(value, key) {
            find(value, key)
        })

        function find(data, str) {
            var type = $.type(data);
            if (type === 'object') {
                each(data, function(value, key) {
                    find(value, str + "[" + key + "]")
                })
            } else if (type === 'array') {
                each(data, function(value, key) {
                    var type = $.type(value);
                    if (type !== 'object' && type !== 'array') {
                        arr.push(str + '[]=' + value);
                    } else {
                        find(value, str + "[" + key + "]")
                    }
                })
            } else {
                arr.push(encodeURIComponent(str) + '=' + encodeURIComponent(data));
            }
        }
        return arr.join('&');
    }

    var s = get({ a: 3, b: 444, c: { d: 33, e: [{ b: "&dds?=dd" }] } })

    function query(search) {
        var data = {};
        search = search || location.search;
        if (search[0] === '?') {
            search = search.substr(1)
        }
        each(search.split('&'), function(value) {
            if (value) {
                value = value.split('=', 2)
                data[decodeURIComponent(value[0])] = decodeURIComponent(value[1])
            }
        })
        each(data, function(value, key) {
            key.replace(/\w+(\[(\w+)\])*/, function() {
                console.log(arguments)
            })
        })
        return data;
    }

    function extend(src, obj, deep) {
        var out = {};
        each(obj, function(value, key) {
            if (deep && typeof value === 'object') {
                src[key] = src[key] || {};
                extend(src[key], value, deep);
            } else {
                src[key] = value;
            }
        })
        return src;
    }

    $.extend = function() {
        var out = {};
        each(arguments, function(argument) {
            extend(out, argument)
        })
        return out;
    }

    function ajax(url) {
        this.url = url;
    }
    ajax.prototype.data = function(data) {
        this.data = data;
        return this;
    }
    ajax.prototype.header = function(header) {
        this.header = header;
        return this;
    }
    ajax.prototype.then = function(callback) {
        this.callback = callback;
        var self = this;
        setTimeout(function(argument) {
            self.callback.call(this)
        })
        return this;
    }
    $.ajax = function(argument) {
        return new ajax(argument)
    };

    function callback() {
        this.lists = [];
    }
    callback.prototype.fire = function(data) {
        each(this.lists, function(callback) {
            callback(data);
        })
    }
    callback.prototype.on = function(callback) {
        this.lists.push(callback);
    }
    callback.prototype.off = function(callback) {
        callback ? each(this.lists, function(argument, index) {
            if (callback === argument) {
                this.lists.splice(index, 1);
                return false;
            }
        }) : (this.lists = []);
    }
    this.$ = $;
})()