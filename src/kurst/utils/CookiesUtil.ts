/*
 * Credits: Christophe Porteneuve ( https://github.com/tdd )
 *          Karim Beyrouti - typescript conversion - karim@kurst.co.uk
 */

module kurst.utils {

    export class CookiesUtil{

        //------------------------------------------------------------------------------------------

        /*
         */
        static get( name : string ) : Object {

            return CookiesUtil.has(name) ? CookiesUtil.list()[name] : null;

        }
        /*
         */
        static has( name : string ) : Object {

            var cookieStr : string = <string> document.cookie;
            return new RegExp("(?:;\\s*|^)" + encodeURIComponent(name) + '=').test( cookieStr );

        }
        /*
         */
        static list( nameRegExp ? ) : Object {

            var pairs = document.cookie.split(';'), pair, result = {};

            for (var index = 0, len = pairs.length; index < len; ++index) {

                pair = pairs[index].split('=');
                pair[0] = pair[0].replace(/^\s+|\s+$/, '');

                if (!CookiesUtil.isRegExp(nameRegExp) || nameRegExp.test(pair[0]))
                    result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);


            }

            return result;

        }
        /*
         */
        static set(name, value, options ? ) {

            options = options || {};

            var def : Object[] = <Object[]> [encodeURIComponent(name) + '=' + encodeURIComponent(value)];

            if (options.path) {

                def.push('path=' + options.path);

            }
            if (options.domain) {

                def.push('domain=' + options.domain);

            }

            var maxAge = 'maxAge' in options ? options.maxAge :
                ('max_age' in options ? options['max_age'] : options['max-age']), maxAgeNbr;

            if ('undefined' != typeof maxAge && 'null' != typeof maxAge && (!isNaN(maxAgeNbr = parseFloat(maxAge))))
                def.push('max-age=' + maxAgeNbr);

            var expires = CookiesUtil.isDate(options.expires) ? options.expires.toUTCString() : options.expires;

            if (expires) {

                def.push('expires=' + expires);

            }

            if (options['secure']) {

                def.push('secure');

            }

            var str : string = def.join(';');

            document.cookie = str;

            return def;

        }
        /*
         */
        static remove(name : string , options ? ) {

            var opt2 = {};

            for (var key in (options || {})) {

                opt2[key] = options[key];

            }

            opt2['expires'] = new Date(0);
            opt2['maxAge'] = -1;
            return CookiesUtil.set(name, null, opt2);

        }

        //------------------------------------------------------------------------------------------

        /*
         */
        static isRegExp( o ) {

            return '[object RegExp]' == Object.prototype.toString.call(o);

        }
        /*
         */
        static isDate( o ) {

            return '[object RegExp]' == Object.prototype.toString.call(o);

        }

    }

}
