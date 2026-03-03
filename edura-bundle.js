var xf = (e) => {
  throw TypeError(e);
};
var ga = (e, t, n) => t.has(e) || xf("Cannot " + n);
var C = (e, t, n) => (
    ga(e, t, "read from private field"),
    n ? n.call(e) : t.get(e)
  ),
  U = (e, t, n) =>
    t.has(e)
      ? xf("Cannot add the same private member more than once")
      : t instanceof WeakSet
        ? t.add(e)
        : t.set(e, n),
  L = (e, t, n, r) => (
    ga(e, t, "write to private field"),
    r ? r.call(e, n) : t.set(e, n),
    n
  ),
  Y = (e, t, n) => (ga(e, t, "access private method"), n);
var ii = (e, t, n, r) => ({
  set _(o) {
    L(e, t, o, n);
  },
  get _() {
    return C(e, t, r);
  },
});
function uw(e, t) {
  for (var n = 0; n < t.length; n++) {
    const r = t[n];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const o in r)
        if (o !== "default" && !(o in e)) {
          const s = Object.getOwnPropertyDescriptor(r, o);
          s &&
            Object.defineProperty(
              e,
              o,
              s.get ? s : { enumerable: !0, get: () => r[o] },
            );
        }
    }
  }
  return Object.freeze(
    Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
  );
}
(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) r(o);
  new MutationObserver((o) => {
    for (const s of o)
      if (s.type === "childList")
        for (const i of s.addedNodes)
          i.tagName === "LINK" && i.rel === "modulepreload" && r(i);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(o) {
    const s = {};
    return (
      o.integrity && (s.integrity = o.integrity),
      o.referrerPolicy && (s.referrerPolicy = o.referrerPolicy),
      o.crossOrigin === "use-credentials"
        ? (s.credentials = "include")
        : o.crossOrigin === "anonymous"
          ? (s.credentials = "omit")
          : (s.credentials = "same-origin"),
      s
    );
  }
  function r(o) {
    if (o.ep) return;
    o.ep = !0;
    const s = n(o);
    fetch(o.href, s);
  }
})();
function Ih(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")
    ? e.default
    : e;
}
var Mh = { exports: {} },
  Ll = {},
  Lh = { exports: {} },
  X = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Ys = Symbol.for("react.element"),
  dw = Symbol.for("react.portal"),
  fw = Symbol.for("react.fragment"),
  pw = Symbol.for("react.strict_mode"),
  hw = Symbol.for("react.profiler"),
  mw = Symbol.for("react.provider"),
  gw = Symbol.for("react.context"),
  vw = Symbol.for("react.forward_ref"),
  yw = Symbol.for("react.suspense"),
  xw = Symbol.for("react.memo"),
  ww = Symbol.for("react.lazy"),
  wf = Symbol.iterator;
function Sw(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (wf && e[wf]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var Dh = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  Fh = Object.assign,
  zh = {};
function $o(e, t, n) {
  ((this.props = e),
    (this.context = t),
    (this.refs = zh),
    (this.updater = n || Dh));
}
$o.prototype.isReactComponent = {};
$o.prototype.setState = function (e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
    );
  this.updater.enqueueSetState(this, e, t, "setState");
};
$o.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function $h() {}
$h.prototype = $o.prototype;
function _u(e, t, n) {
  ((this.props = e),
    (this.context = t),
    (this.refs = zh),
    (this.updater = n || Dh));
}
var Ou = (_u.prototype = new $h());
Ou.constructor = _u;
Fh(Ou, $o.prototype);
Ou.isPureReactComponent = !0;
var Sf = Array.isArray,
  Uh = Object.prototype.hasOwnProperty,
  Iu = { current: null },
  Bh = { key: !0, ref: !0, __self: !0, __source: !0 };
function Hh(e, t, n) {
  var r,
    o = {},
    s = null,
    i = null;
  if (t != null)
    for (r in (t.ref !== void 0 && (i = t.ref),
    t.key !== void 0 && (s = "" + t.key),
    t))
      Uh.call(t, r) && !Bh.hasOwnProperty(r) && (o[r] = t[r]);
  var a = arguments.length - 2;
  if (a === 1) o.children = n;
  else if (1 < a) {
    for (var c = Array(a), u = 0; u < a; u++) c[u] = arguments[u + 2];
    o.children = c;
  }
  if (e && e.defaultProps)
    for (r in ((a = e.defaultProps), a)) o[r] === void 0 && (o[r] = a[r]);
  return {
    $$typeof: Ys,
    type: e,
    key: s,
    ref: i,
    props: o,
    _owner: Iu.current,
  };
}
function bw(e, t) {
  return {
    $$typeof: Ys,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function Mu(e) {
  return typeof e == "object" && e !== null && e.$$typeof === Ys;
}
function Cw(e) {
  var t = { "=": "=0", ":": "=2" };
  return (
    "$" +
    e.replace(/[=:]/g, function (n) {
      return t[n];
    })
  );
}
var bf = /\/+/g;
function va(e, t) {
  return typeof e == "object" && e !== null && e.key != null
    ? Cw("" + e.key)
    : t.toString(36);
}
function Oi(e, t, n, r, o) {
  var s = typeof e;
  (s === "undefined" || s === "boolean") && (e = null);
  var i = !1;
  if (e === null) i = !0;
  else
    switch (s) {
      case "string":
      case "number":
        i = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case Ys:
          case dw:
            i = !0;
        }
    }
  if (i)
    return (
      (i = e),
      (o = o(i)),
      (e = r === "" ? "." + va(i, 0) : r),
      Sf(o)
        ? ((n = ""),
          e != null && (n = e.replace(bf, "$&/") + "/"),
          Oi(o, t, n, "", function (u) {
            return u;
          }))
        : o != null &&
          (Mu(o) &&
            (o = bw(
              o,
              n +
                (!o.key || (i && i.key === o.key)
                  ? ""
                  : ("" + o.key).replace(bf, "$&/") + "/") +
                e,
            )),
          t.push(o)),
      1
    );
  if (((i = 0), (r = r === "" ? "." : r + ":"), Sf(e)))
    for (var a = 0; a < e.length; a++) {
      s = e[a];
      var c = r + va(s, a);
      i += Oi(s, t, n, c, o);
    }
  else if (((c = Sw(e)), typeof c == "function"))
    for (e = c.call(e), a = 0; !(s = e.next()).done; )
      ((s = s.value), (c = r + va(s, a++)), (i += Oi(s, t, n, c, o)));
  else if (s === "object")
    throw (
      (t = String(e)),
      Error(
        "Objects are not valid as a React child (found: " +
          (t === "[object Object]"
            ? "object with keys {" + Object.keys(e).join(", ") + "}"
            : t) +
          "). If you meant to render a collection of children, use an array instead.",
      )
    );
  return i;
}
function li(e, t, n) {
  if (e == null) return e;
  var r = [],
    o = 0;
  return (
    Oi(e, r, "", "", function (s) {
      return t.call(n, s, o++);
    }),
    r
  );
}
function Nw(e) {
  if (e._status === -1) {
    var t = e._result;
    ((t = t()),
      t.then(
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 1), (e._result = n));
        },
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 2), (e._result = n));
        },
      ),
      e._status === -1 && ((e._status = 0), (e._result = t)));
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var Ye = { current: null },
  Ii = { transition: null },
  Ew = {
    ReactCurrentDispatcher: Ye,
    ReactCurrentBatchConfig: Ii,
    ReactCurrentOwner: Iu,
  };
function Vh() {
  throw Error("act(...) is not supported in production builds of React.");
}
X.Children = {
  map: li,
  forEach: function (e, t, n) {
    li(
      e,
      function () {
        t.apply(this, arguments);
      },
      n,
    );
  },
  count: function (e) {
    var t = 0;
    return (
      li(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      li(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!Mu(e))
      throw Error(
        "React.Children.only expected to receive a single React element child.",
      );
    return e;
  },
};
X.Component = $o;
X.Fragment = fw;
X.Profiler = hw;
X.PureComponent = _u;
X.StrictMode = pw;
X.Suspense = yw;
X.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ew;
X.act = Vh;
X.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " +
        e +
        ".",
    );
  var r = Fh({}, e.props),
    o = e.key,
    s = e.ref,
    i = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((s = t.ref), (i = Iu.current)),
      t.key !== void 0 && (o = "" + t.key),
      e.type && e.type.defaultProps)
    )
      var a = e.type.defaultProps;
    for (c in t)
      Uh.call(t, c) &&
        !Bh.hasOwnProperty(c) &&
        (r[c] = t[c] === void 0 && a !== void 0 ? a[c] : t[c]);
  }
  var c = arguments.length - 2;
  if (c === 1) r.children = n;
  else if (1 < c) {
    a = Array(c);
    for (var u = 0; u < c; u++) a[u] = arguments[u + 2];
    r.children = a;
  }
  return { $$typeof: Ys, type: e.type, key: o, ref: s, props: r, _owner: i };
};
X.createContext = function (e) {
  return (
    (e = {
      $$typeof: gw,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: mw, _context: e }),
    (e.Consumer = e)
  );
};
X.createElement = Hh;
X.createFactory = function (e) {
  var t = Hh.bind(null, e);
  return ((t.type = e), t);
};
X.createRef = function () {
  return { current: null };
};
X.forwardRef = function (e) {
  return { $$typeof: vw, render: e };
};
X.isValidElement = Mu;
X.lazy = function (e) {
  return { $$typeof: ww, _payload: { _status: -1, _result: e }, _init: Nw };
};
X.memo = function (e, t) {
  return { $$typeof: xw, type: e, compare: t === void 0 ? null : t };
};
X.startTransition = function (e) {
  var t = Ii.transition;
  Ii.transition = {};
  try {
    e();
  } finally {
    Ii.transition = t;
  }
};
X.unstable_act = Vh;
X.useCallback = function (e, t) {
  return Ye.current.useCallback(e, t);
};
X.useContext = function (e) {
  return Ye.current.useContext(e);
};
X.useDebugValue = function () {};
X.useDeferredValue = function (e) {
  return Ye.current.useDeferredValue(e);
};
X.useEffect = function (e, t) {
  return Ye.current.useEffect(e, t);
};
X.useId = function () {
  return Ye.current.useId();
};
X.useImperativeHandle = function (e, t, n) {
  return Ye.current.useImperativeHandle(e, t, n);
};
X.useInsertionEffect = function (e, t) {
  return Ye.current.useInsertionEffect(e, t);
};
X.useLayoutEffect = function (e, t) {
  return Ye.current.useLayoutEffect(e, t);
};
X.useMemo = function (e, t) {
  return Ye.current.useMemo(e, t);
};
X.useReducer = function (e, t, n) {
  return Ye.current.useReducer(e, t, n);
};
X.useRef = function (e) {
  return Ye.current.useRef(e);
};
X.useState = function (e) {
  return Ye.current.useState(e);
};
X.useSyncExternalStore = function (e, t, n) {
  return Ye.current.useSyncExternalStore(e, t, n);
};
X.useTransition = function () {
  return Ye.current.useTransition();
};
X.version = "18.3.1";
Lh.exports = X;
var f = Lh.exports;
const Qe = Ih(f),
  Wh = uw({ __proto__: null, default: Qe }, [f]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var jw = f,
  kw = Symbol.for("react.element"),
  Pw = Symbol.for("react.fragment"),
  Tw = Object.prototype.hasOwnProperty,
  Rw = jw.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  Aw = { key: !0, ref: !0, __self: !0, __source: !0 };
function Kh(e, t, n) {
  var r,
    o = {},
    s = null,
    i = null;
  (n !== void 0 && (s = "" + n),
    t.key !== void 0 && (s = "" + t.key),
    t.ref !== void 0 && (i = t.ref));
  for (r in t) Tw.call(t, r) && !Aw.hasOwnProperty(r) && (o[r] = t[r]);
  if (e && e.defaultProps)
    for (r in ((t = e.defaultProps), t)) o[r] === void 0 && (o[r] = t[r]);
  return {
    $$typeof: kw,
    type: e,
    key: s,
    ref: i,
    props: o,
    _owner: Rw.current,
  };
}
Ll.Fragment = Pw;
Ll.jsx = Kh;
Ll.jsxs = Kh;
Mh.exports = Ll;
var l = Mh.exports,
  Qh = { exports: {} },
  ft = {},
  Gh = { exports: {} },
  Yh = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  function t(T, _) {
    var z = T.length;
    T.push(_);
    e: for (; 0 < z; ) {
      var W = (z - 1) >>> 1,
        oe = T[W];
      if (0 < o(oe, _)) ((T[W] = _), (T[z] = oe), (z = W));
      else break e;
    }
  }
  function n(T) {
    return T.length === 0 ? null : T[0];
  }
  function r(T) {
    if (T.length === 0) return null;
    var _ = T[0],
      z = T.pop();
    if (z !== _) {
      T[0] = z;
      e: for (var W = 0, oe = T.length, Be = oe >>> 1; W < Be; ) {
        var Ne = 2 * (W + 1) - 1,
          zt = T[Ne],
          He = Ne + 1,
          B = T[He];
        if (0 > o(zt, z))
          He < oe && 0 > o(B, zt)
            ? ((T[W] = B), (T[He] = z), (W = He))
            : ((T[W] = zt), (T[Ne] = z), (W = Ne));
        else if (He < oe && 0 > o(B, z)) ((T[W] = B), (T[He] = z), (W = He));
        else break e;
      }
    }
    return _;
  }
  function o(T, _) {
    var z = T.sortIndex - _.sortIndex;
    return z !== 0 ? z : T.id - _.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var s = performance;
    e.unstable_now = function () {
      return s.now();
    };
  } else {
    var i = Date,
      a = i.now();
    e.unstable_now = function () {
      return i.now() - a;
    };
  }
  var c = [],
    u = [],
    d = 1,
    p = null,
    h = 3,
    x = !1,
    S = !1,
    v = !1,
    w = typeof setTimeout == "function" ? setTimeout : null,
    g = typeof clearTimeout == "function" ? clearTimeout : null,
    m = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function y(T) {
    for (var _ = n(u); _ !== null; ) {
      if (_.callback === null) r(u);
      else if (_.startTime <= T)
        (r(u), (_.sortIndex = _.expirationTime), t(c, _));
      else break;
      _ = n(u);
    }
  }
  function b(T) {
    if (((v = !1), y(T), !S))
      if (n(c) !== null) ((S = !0), F(E));
      else {
        var _ = n(u);
        _ !== null && Q(b, _.startTime - T);
      }
  }
  function E(T, _) {
    ((S = !1), v && ((v = !1), g(j), (j = -1)), (x = !0));
    var z = h;
    try {
      for (
        y(_), p = n(c);
        p !== null && (!(p.expirationTime > _) || (T && !M()));
      ) {
        var W = p.callback;
        if (typeof W == "function") {
          ((p.callback = null), (h = p.priorityLevel));
          var oe = W(p.expirationTime <= _);
          ((_ = e.unstable_now()),
            typeof oe == "function" ? (p.callback = oe) : p === n(c) && r(c),
            y(_));
        } else r(c);
        p = n(c);
      }
      if (p !== null) var Be = !0;
      else {
        var Ne = n(u);
        (Ne !== null && Q(b, Ne.startTime - _), (Be = !1));
      }
      return Be;
    } finally {
      ((p = null), (h = z), (x = !1));
    }
  }
  var k = !1,
    N = null,
    j = -1,
    P = 5,
    R = -1;
  function M() {
    return !(e.unstable_now() - R < P);
  }
  function I() {
    if (N !== null) {
      var T = e.unstable_now();
      R = T;
      var _ = !0;
      try {
        _ = N(!0, T);
      } finally {
        _ ? V() : ((k = !1), (N = null));
      }
    } else k = !1;
  }
  var V;
  if (typeof m == "function")
    V = function () {
      m(I);
    };
  else if (typeof MessageChannel < "u") {
    var O = new MessageChannel(),
      K = O.port2;
    ((O.port1.onmessage = I),
      (V = function () {
        K.postMessage(null);
      }));
  } else
    V = function () {
      w(I, 0);
    };
  function F(T) {
    ((N = T), k || ((k = !0), V()));
  }
  function Q(T, _) {
    j = w(function () {
      T(e.unstable_now());
    }, _);
  }
  ((e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (T) {
      T.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      S || x || ((S = !0), F(E));
    }),
    (e.unstable_forceFrameRate = function (T) {
      0 > T || 125 < T
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
          )
        : (P = 0 < T ? Math.floor(1e3 / T) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return h;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(c);
    }),
    (e.unstable_next = function (T) {
      switch (h) {
        case 1:
        case 2:
        case 3:
          var _ = 3;
          break;
        default:
          _ = h;
      }
      var z = h;
      h = _;
      try {
        return T();
      } finally {
        h = z;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (T, _) {
      switch (T) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          T = 3;
      }
      var z = h;
      h = T;
      try {
        return _();
      } finally {
        h = z;
      }
    }),
    (e.unstable_scheduleCallback = function (T, _, z) {
      var W = e.unstable_now();
      switch (
        (typeof z == "object" && z !== null
          ? ((z = z.delay), (z = typeof z == "number" && 0 < z ? W + z : W))
          : (z = W),
        T)
      ) {
        case 1:
          var oe = -1;
          break;
        case 2:
          oe = 250;
          break;
        case 5:
          oe = 1073741823;
          break;
        case 4:
          oe = 1e4;
          break;
        default:
          oe = 5e3;
      }
      return (
        (oe = z + oe),
        (T = {
          id: d++,
          callback: _,
          priorityLevel: T,
          startTime: z,
          expirationTime: oe,
          sortIndex: -1,
        }),
        z > W
          ? ((T.sortIndex = z),
            t(u, T),
            n(c) === null &&
              T === n(u) &&
              (v ? (g(j), (j = -1)) : (v = !0), Q(b, z - W)))
          : ((T.sortIndex = oe), t(c, T), S || x || ((S = !0), F(E))),
        T
      );
    }),
    (e.unstable_shouldYield = M),
    (e.unstable_wrapCallback = function (T) {
      var _ = h;
      return function () {
        var z = h;
        h = _;
        try {
          return T.apply(this, arguments);
        } finally {
          h = z;
        }
      };
    }));
})(Yh);
Gh.exports = Yh;
var _w = Gh.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Ow = f,
  dt = _w;
function A(e) {
  for (
    var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1;
    n < arguments.length;
    n++
  )
    t += "&args[]=" + encodeURIComponent(arguments[n]);
  return (
    "Minified React error #" +
    e +
    "; visit " +
    t +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
  );
}
var qh = new Set(),
  Ns = {};
function Dr(e, t) {
  (ko(e, t), ko(e + "Capture", t));
}
function ko(e, t) {
  for (Ns[e] = t, e = 0; e < t.length; e++) qh.add(t[e]);
}
var hn = !(
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
  ),
  ic = Object.prototype.hasOwnProperty,
  Iw =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  Cf = {},
  Nf = {};
function Mw(e) {
  return ic.call(Nf, e)
    ? !0
    : ic.call(Cf, e)
      ? !1
      : Iw.test(e)
        ? (Nf[e] = !0)
        : ((Cf[e] = !0), !1);
}
function Lw(e, t, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r
        ? !1
        : n !== null
          ? !n.acceptsBooleans
          : ((e = e.toLowerCase().slice(0, 5)), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function Dw(e, t, n, r) {
  if (t === null || typeof t > "u" || Lw(e, t, n, r)) return !0;
  if (r) return !1;
  if (n !== null)
    switch (n.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
  return !1;
}
function qe(e, t, n, r, o, s, i) {
  ((this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = o),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = s),
    (this.removeEmptyString = i));
}
var Me = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (e) {
    Me[e] = new qe(e, 0, !1, e, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (e) {
  var t = e[0];
  Me[t] = new qe(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  Me[e] = new qe(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (e) {
  Me[e] = new qe(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (e) {
    Me[e] = new qe(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  Me[e] = new qe(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
  Me[e] = new qe(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  Me[e] = new qe(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
  Me[e] = new qe(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var Lu = /[\-:]([a-z])/g;
function Du(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(Lu, Du);
    Me[t] = new qe(t, 1, !1, e, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(Lu, Du);
    Me[t] = new qe(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(Lu, Du);
  Me[t] = new qe(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  Me[e] = new qe(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
Me.xlinkHref = new qe(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1,
);
["src", "href", "action", "formAction"].forEach(function (e) {
  Me[e] = new qe(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function Fu(e, t, n, r) {
  var o = Me.hasOwnProperty(t) ? Me[t] : null;
  (o !== null
    ? o.type !== 0
    : r ||
      !(2 < t.length) ||
      (t[0] !== "o" && t[0] !== "O") ||
      (t[1] !== "n" && t[1] !== "N")) &&
    (Dw(t, n, o, r) && (n = null),
    r || o === null
      ? Mw(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
      : o.mustUseProperty
        ? (e[o.propertyName] = n === null ? (o.type === 3 ? !1 : "") : n)
        : ((t = o.attributeName),
          (r = o.attributeNamespace),
          n === null
            ? e.removeAttribute(t)
            : ((o = o.type),
              (n = o === 3 || (o === 4 && n === !0) ? "" : "" + n),
              r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var Sn = Ow.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  ai = Symbol.for("react.element"),
  Vr = Symbol.for("react.portal"),
  Wr = Symbol.for("react.fragment"),
  zu = Symbol.for("react.strict_mode"),
  lc = Symbol.for("react.profiler"),
  Xh = Symbol.for("react.provider"),
  Zh = Symbol.for("react.context"),
  $u = Symbol.for("react.forward_ref"),
  ac = Symbol.for("react.suspense"),
  cc = Symbol.for("react.suspense_list"),
  Uu = Symbol.for("react.memo"),
  Tn = Symbol.for("react.lazy"),
  Jh = Symbol.for("react.offscreen"),
  Ef = Symbol.iterator;
function Zo(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (Ef && e[Ef]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var ge = Object.assign,
  ya;
function as(e) {
  if (ya === void 0)
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      ya = (t && t[1]) || "";
    }
  return (
    `
` +
    ya +
    e
  );
}
var xa = !1;
function wa(e, t) {
  if (!e || xa) return "";
  xa = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t)
      if (
        ((t = function () {
          throw Error();
        }),
        Object.defineProperty(t.prototype, "props", {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == "object" && Reflect.construct)
      ) {
        try {
          Reflect.construct(t, []);
        } catch (u) {
          var r = u;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (u) {
          r = u;
        }
        e.call(t.prototype);
      }
    else {
      try {
        throw Error();
      } catch (u) {
        r = u;
      }
      e();
    }
  } catch (u) {
    if (u && r && typeof u.stack == "string") {
      for (
        var o = u.stack.split(`
`),
          s = r.stack.split(`
`),
          i = o.length - 1,
          a = s.length - 1;
        1 <= i && 0 <= a && o[i] !== s[a];
      )
        a--;
      for (; 1 <= i && 0 <= a; i--, a--)
        if (o[i] !== s[a]) {
          if (i !== 1 || a !== 1)
            do
              if ((i--, a--, 0 > a || o[i] !== s[a])) {
                var c =
                  `
` + o[i].replace(" at new ", " at ");
                return (
                  e.displayName &&
                    c.includes("<anonymous>") &&
                    (c = c.replace("<anonymous>", e.displayName)),
                  c
                );
              }
            while (1 <= i && 0 <= a);
          break;
        }
    }
  } finally {
    ((xa = !1), (Error.prepareStackTrace = n));
  }
  return (e = e ? e.displayName || e.name : "") ? as(e) : "";
}
function Fw(e) {
  switch (e.tag) {
    case 5:
      return as(e.type);
    case 16:
      return as("Lazy");
    case 13:
      return as("Suspense");
    case 19:
      return as("SuspenseList");
    case 0:
    case 2:
    case 15:
      return ((e = wa(e.type, !1)), e);
    case 11:
      return ((e = wa(e.type.render, !1)), e);
    case 1:
      return ((e = wa(e.type, !0)), e);
    default:
      return "";
  }
}
function uc(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case Wr:
      return "Fragment";
    case Vr:
      return "Portal";
    case lc:
      return "Profiler";
    case zu:
      return "StrictMode";
    case ac:
      return "Suspense";
    case cc:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case Zh:
        return (e.displayName || "Context") + ".Consumer";
      case Xh:
        return (e._context.displayName || "Context") + ".Provider";
      case $u:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ""),
            (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
          e
        );
      case Uu:
        return (
          (t = e.displayName || null),
          t !== null ? t : uc(e.type) || "Memo"
        );
      case Tn:
        ((t = e._payload), (e = e._init));
        try {
          return uc(e(t));
        } catch {}
    }
  return null;
}
function zw(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (t.displayName || "Context") + ".Consumer";
    case 10:
      return (t._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return (
        (e = t.render),
        (e = e.displayName || e.name || ""),
        t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")
      );
    case 7:
      return "Fragment";
    case 5:
      return t;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return uc(t);
    case 8:
      return t === zu ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == "function") return t.displayName || t.name || null;
      if (typeof t == "string") return t;
  }
  return null;
}
function Jn(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function em(e) {
  var t = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === "input" &&
    (t === "checkbox" || t === "radio")
  );
}
function $w(e) {
  var t = em(e) ? "checked" : "value",
    n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    r = "" + e[t];
  if (
    !e.hasOwnProperty(t) &&
    typeof n < "u" &&
    typeof n.get == "function" &&
    typeof n.set == "function"
  ) {
    var o = n.get,
      s = n.set;
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return o.call(this);
        },
        set: function (i) {
          ((r = "" + i), s.call(this, i));
        },
      }),
      Object.defineProperty(e, t, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return r;
        },
        setValue: function (i) {
          r = "" + i;
        },
        stopTracking: function () {
          ((e._valueTracker = null), delete e[t]);
        },
      }
    );
  }
}
function ci(e) {
  e._valueTracker || (e._valueTracker = $w(e));
}
function tm(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(),
    r = "";
  return (
    e && (r = em(e) ? (e.checked ? "true" : "false") : e.value),
    (e = r),
    e !== n ? (t.setValue(e), !0) : !1
  );
}
function Xi(e) {
  if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u"))
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function dc(e, t) {
  var n = t.checked;
  return ge({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n ?? e._wrapperState.initialChecked,
  });
}
function jf(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked;
  ((n = Jn(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled:
        t.type === "checkbox" || t.type === "radio"
          ? t.checked != null
          : t.value != null,
    }));
}
function nm(e, t) {
  ((t = t.checked), t != null && Fu(e, "checked", t, !1));
}
function fc(e, t) {
  nm(e, t);
  var n = Jn(t.value),
    r = t.type;
  if (n != null)
    r === "number"
      ? ((n === 0 && e.value === "") || e.value != n) && (e.value = "" + n)
      : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  (t.hasOwnProperty("value")
    ? pc(e, t.type, n)
    : t.hasOwnProperty("defaultValue") && pc(e, t.type, Jn(t.defaultValue)),
    t.checked == null &&
      t.defaultChecked != null &&
      (e.defaultChecked = !!t.defaultChecked));
}
function kf(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (
      !(
        (r !== "submit" && r !== "reset") ||
        (t.value !== void 0 && t.value !== null)
      )
    )
      return;
    ((t = "" + e._wrapperState.initialValue),
      n || t === e.value || (e.value = t),
      (e.defaultValue = t));
  }
  ((n = e.name),
    n !== "" && (e.name = ""),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    n !== "" && (e.name = n));
}
function pc(e, t, n) {
  (t !== "number" || Xi(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = "" + e._wrapperState.initialValue)
      : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var cs = Array.isArray;
function no(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {};
    for (var o = 0; o < n.length; o++) t["$" + n[o]] = !0;
    for (n = 0; n < e.length; n++)
      ((o = t.hasOwnProperty("$" + e[n].value)),
        e[n].selected !== o && (e[n].selected = o),
        o && r && (e[n].defaultSelected = !0));
  } else {
    for (n = "" + Jn(n), t = null, o = 0; o < e.length; o++) {
      if (e[o].value === n) {
        ((e[o].selected = !0), r && (e[o].defaultSelected = !0));
        return;
      }
      t !== null || e[o].disabled || (t = e[o]);
    }
    t !== null && (t.selected = !0);
  }
}
function hc(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(A(91));
  return ge({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue,
  });
}
function Pf(e, t) {
  var n = t.value;
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(A(92));
      if (cs(n)) {
        if (1 < n.length) throw Error(A(93));
        n = n[0];
      }
      t = n;
    }
    (t == null && (t = ""), (n = t));
  }
  e._wrapperState = { initialValue: Jn(n) };
}
function rm(e, t) {
  var n = Jn(t.value),
    r = Jn(t.defaultValue);
  (n != null &&
    ((n = "" + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = "" + r));
}
function Tf(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function om(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function mc(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml"
    ? om(t)
    : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
      ? "http://www.w3.org/1999/xhtml"
      : e;
}
var ui,
  sm = (function (e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
      ? function (t, n, r, o) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, n, r, o);
          });
        }
      : e;
  })(function (e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
      e.innerHTML = t;
    else {
      for (
        ui = ui || document.createElement("div"),
          ui.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
          t = ui.firstChild;
        e.firstChild;
      )
        e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
function Es(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var hs = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  Uw = ["Webkit", "ms", "Moz", "O"];
Object.keys(hs).forEach(function (e) {
  Uw.forEach(function (t) {
    ((t = t + e.charAt(0).toUpperCase() + e.substring(1)), (hs[t] = hs[e]));
  });
});
function im(e, t, n) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : n || typeof t != "number" || t === 0 || (hs.hasOwnProperty(e) && hs[e])
      ? ("" + t).trim()
      : t + "px";
}
function lm(e, t) {
  e = e.style;
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0,
        o = im(n, t[n], r);
      (n === "float" && (n = "cssFloat"), r ? e.setProperty(n, o) : (e[n] = o));
    }
}
var Bw = ge(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  },
);
function gc(e, t) {
  if (t) {
    if (Bw[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
      throw Error(A(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(A(60));
      if (
        typeof t.dangerouslySetInnerHTML != "object" ||
        !("__html" in t.dangerouslySetInnerHTML)
      )
        throw Error(A(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(A(62));
  }
}
function vc(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var yc = null;
function Bu(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var xc = null,
  ro = null,
  oo = null;
function Rf(e) {
  if ((e = Zs(e))) {
    if (typeof xc != "function") throw Error(A(280));
    var t = e.stateNode;
    t && ((t = Ul(t)), xc(e.stateNode, e.type, t));
  }
}
function am(e) {
  ro ? (oo ? oo.push(e) : (oo = [e])) : (ro = e);
}
function cm() {
  if (ro) {
    var e = ro,
      t = oo;
    if (((oo = ro = null), Rf(e), t)) for (e = 0; e < t.length; e++) Rf(t[e]);
  }
}
function um(e, t) {
  return e(t);
}
function dm() {}
var Sa = !1;
function fm(e, t, n) {
  if (Sa) return e(t, n);
  Sa = !0;
  try {
    return um(e, t, n);
  } finally {
    ((Sa = !1), (ro !== null || oo !== null) && (dm(), cm()));
  }
}
function js(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = Ul(n);
  if (r === null) return null;
  n = r[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      ((r = !r.disabled) ||
        ((e = e.type),
        (r = !(
          e === "button" ||
          e === "input" ||
          e === "select" ||
          e === "textarea"
        ))),
        (e = !r));
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != "function") throw Error(A(231, t, typeof n));
  return n;
}
var wc = !1;
if (hn)
  try {
    var Jo = {};
    (Object.defineProperty(Jo, "passive", {
      get: function () {
        wc = !0;
      },
    }),
      window.addEventListener("test", Jo, Jo),
      window.removeEventListener("test", Jo, Jo));
  } catch {
    wc = !1;
  }
function Hw(e, t, n, r, o, s, i, a, c) {
  var u = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, u);
  } catch (d) {
    this.onError(d);
  }
}
var ms = !1,
  Zi = null,
  Ji = !1,
  Sc = null,
  Vw = {
    onError: function (e) {
      ((ms = !0), (Zi = e));
    },
  };
function Ww(e, t, n, r, o, s, i, a, c) {
  ((ms = !1), (Zi = null), Hw.apply(Vw, arguments));
}
function Kw(e, t, n, r, o, s, i, a, c) {
  if ((Ww.apply(this, arguments), ms)) {
    if (ms) {
      var u = Zi;
      ((ms = !1), (Zi = null));
    } else throw Error(A(198));
    Ji || ((Ji = !0), (Sc = u));
  }
}
function Fr(e) {
  var t = e,
    n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do ((t = e), t.flags & 4098 && (n = t.return), (e = t.return));
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function pm(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (
      (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
      t !== null)
    )
      return t.dehydrated;
  }
  return null;
}
function Af(e) {
  if (Fr(e) !== e) throw Error(A(188));
}
function Qw(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = Fr(e)), t === null)) throw Error(A(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var o = n.return;
    if (o === null) break;
    var s = o.alternate;
    if (s === null) {
      if (((r = o.return), r !== null)) {
        n = r;
        continue;
      }
      break;
    }
    if (o.child === s.child) {
      for (s = o.child; s; ) {
        if (s === n) return (Af(o), e);
        if (s === r) return (Af(o), t);
        s = s.sibling;
      }
      throw Error(A(188));
    }
    if (n.return !== r.return) ((n = o), (r = s));
    else {
      for (var i = !1, a = o.child; a; ) {
        if (a === n) {
          ((i = !0), (n = o), (r = s));
          break;
        }
        if (a === r) {
          ((i = !0), (r = o), (n = s));
          break;
        }
        a = a.sibling;
      }
      if (!i) {
        for (a = s.child; a; ) {
          if (a === n) {
            ((i = !0), (n = s), (r = o));
            break;
          }
          if (a === r) {
            ((i = !0), (r = s), (n = o));
            break;
          }
          a = a.sibling;
        }
        if (!i) throw Error(A(189));
      }
    }
    if (n.alternate !== r) throw Error(A(190));
  }
  if (n.tag !== 3) throw Error(A(188));
  return n.stateNode.current === n ? e : t;
}
function hm(e) {
  return ((e = Qw(e)), e !== null ? mm(e) : null);
}
function mm(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = mm(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var gm = dt.unstable_scheduleCallback,
  _f = dt.unstable_cancelCallback,
  Gw = dt.unstable_shouldYield,
  Yw = dt.unstable_requestPaint,
  Se = dt.unstable_now,
  qw = dt.unstable_getCurrentPriorityLevel,
  Hu = dt.unstable_ImmediatePriority,
  vm = dt.unstable_UserBlockingPriority,
  el = dt.unstable_NormalPriority,
  Xw = dt.unstable_LowPriority,
  ym = dt.unstable_IdlePriority,
  Dl = null,
  Yt = null;
function Zw(e) {
  if (Yt && typeof Yt.onCommitFiberRoot == "function")
    try {
      Yt.onCommitFiberRoot(Dl, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var At = Math.clz32 ? Math.clz32 : t1,
  Jw = Math.log,
  e1 = Math.LN2;
function t1(e) {
  return ((e >>>= 0), e === 0 ? 32 : (31 - ((Jw(e) / e1) | 0)) | 0);
}
var di = 64,
  fi = 4194304;
function us(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function tl(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0,
    o = e.suspendedLanes,
    s = e.pingedLanes,
    i = n & 268435455;
  if (i !== 0) {
    var a = i & ~o;
    a !== 0 ? (r = us(a)) : ((s &= i), s !== 0 && (r = us(s)));
  } else ((i = n & ~o), i !== 0 ? (r = us(i)) : s !== 0 && (r = us(s)));
  if (r === 0) return 0;
  if (
    t !== 0 &&
    t !== r &&
    !(t & o) &&
    ((o = r & -r), (s = t & -t), o >= s || (o === 16 && (s & 4194240) !== 0))
  )
    return t;
  if ((r & 4 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= r; 0 < t; )
      ((n = 31 - At(t)), (o = 1 << n), (r |= e[n]), (t &= ~o));
  return r;
}
function n1(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function r1(e, t) {
  for (
    var n = e.suspendedLanes,
      r = e.pingedLanes,
      o = e.expirationTimes,
      s = e.pendingLanes;
    0 < s;
  ) {
    var i = 31 - At(s),
      a = 1 << i,
      c = o[i];
    (c === -1
      ? (!(a & n) || a & r) && (o[i] = n1(a, t))
      : c <= t && (e.expiredLanes |= a),
      (s &= ~a));
  }
}
function bc(e) {
  return (
    (e = e.pendingLanes & -1073741825),
    e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
  );
}
function xm() {
  var e = di;
  return ((di <<= 1), !(di & 4194240) && (di = 64), e);
}
function ba(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function qs(e, t, n) {
  ((e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - At(t)),
    (e[t] = n));
}
function o1(e, t) {
  var n = e.pendingLanes & ~t;
  ((e.pendingLanes = t),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= t),
    (e.mutableReadLanes &= t),
    (e.entangledLanes &= t),
    (t = e.entanglements));
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var o = 31 - At(n),
      s = 1 << o;
    ((t[o] = 0), (r[o] = -1), (e[o] = -1), (n &= ~s));
  }
}
function Vu(e, t) {
  var n = (e.entangledLanes |= t);
  for (e = e.entanglements; n; ) {
    var r = 31 - At(n),
      o = 1 << r;
    ((o & t) | (e[r] & t) && (e[r] |= t), (n &= ~o));
  }
}
var re = 0;
function wm(e) {
  return (
    (e &= -e),
    1 < e ? (4 < e ? (e & 268435455 ? 16 : 536870912) : 4) : 1
  );
}
var Sm,
  Wu,
  bm,
  Cm,
  Nm,
  Cc = !1,
  pi = [],
  Vn = null,
  Wn = null,
  Kn = null,
  ks = new Map(),
  Ps = new Map(),
  An = [],
  s1 =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " ",
    );
function Of(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      Vn = null;
      break;
    case "dragenter":
    case "dragleave":
      Wn = null;
      break;
    case "mouseover":
    case "mouseout":
      Kn = null;
      break;
    case "pointerover":
    case "pointerout":
      ks.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Ps.delete(t.pointerId);
  }
}
function es(e, t, n, r, o, s) {
  return e === null || e.nativeEvent !== s
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: s,
        targetContainers: [o],
      }),
      t !== null && ((t = Zs(t)), t !== null && Wu(t)),
      e)
    : ((e.eventSystemFlags |= r),
      (t = e.targetContainers),
      o !== null && t.indexOf(o) === -1 && t.push(o),
      e);
}
function i1(e, t, n, r, o) {
  switch (t) {
    case "focusin":
      return ((Vn = es(Vn, e, t, n, r, o)), !0);
    case "dragenter":
      return ((Wn = es(Wn, e, t, n, r, o)), !0);
    case "mouseover":
      return ((Kn = es(Kn, e, t, n, r, o)), !0);
    case "pointerover":
      var s = o.pointerId;
      return (ks.set(s, es(ks.get(s) || null, e, t, n, r, o)), !0);
    case "gotpointercapture":
      return (
        (s = o.pointerId),
        Ps.set(s, es(Ps.get(s) || null, e, t, n, r, o)),
        !0
      );
  }
  return !1;
}
function Em(e) {
  var t = fr(e.target);
  if (t !== null) {
    var n = Fr(t);
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = pm(n)), t !== null)) {
          ((e.blockedOn = t),
            Nm(e.priority, function () {
              bm(n);
            }));
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function Mi(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = Nc(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      ((yc = r), n.target.dispatchEvent(r), (yc = null));
    } else return ((t = Zs(n)), t !== null && Wu(t), (e.blockedOn = n), !1);
    t.shift();
  }
  return !0;
}
function If(e, t, n) {
  Mi(e) && n.delete(t);
}
function l1() {
  ((Cc = !1),
    Vn !== null && Mi(Vn) && (Vn = null),
    Wn !== null && Mi(Wn) && (Wn = null),
    Kn !== null && Mi(Kn) && (Kn = null),
    ks.forEach(If),
    Ps.forEach(If));
}
function ts(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    Cc ||
      ((Cc = !0),
      dt.unstable_scheduleCallback(dt.unstable_NormalPriority, l1)));
}
function Ts(e) {
  function t(o) {
    return ts(o, e);
  }
  if (0 < pi.length) {
    ts(pi[0], e);
    for (var n = 1; n < pi.length; n++) {
      var r = pi[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (
    Vn !== null && ts(Vn, e),
      Wn !== null && ts(Wn, e),
      Kn !== null && ts(Kn, e),
      ks.forEach(t),
      Ps.forEach(t),
      n = 0;
    n < An.length;
    n++
  )
    ((r = An[n]), r.blockedOn === e && (r.blockedOn = null));
  for (; 0 < An.length && ((n = An[0]), n.blockedOn === null); )
    (Em(n), n.blockedOn === null && An.shift());
}
var so = Sn.ReactCurrentBatchConfig,
  nl = !0;
function a1(e, t, n, r) {
  var o = re,
    s = so.transition;
  so.transition = null;
  try {
    ((re = 1), Ku(e, t, n, r));
  } finally {
    ((re = o), (so.transition = s));
  }
}
function c1(e, t, n, r) {
  var o = re,
    s = so.transition;
  so.transition = null;
  try {
    ((re = 4), Ku(e, t, n, r));
  } finally {
    ((re = o), (so.transition = s));
  }
}
function Ku(e, t, n, r) {
  if (nl) {
    var o = Nc(e, t, n, r);
    if (o === null) (_a(e, t, r, rl, n), Of(e, r));
    else if (i1(o, e, t, n, r)) r.stopPropagation();
    else if ((Of(e, r), t & 4 && -1 < s1.indexOf(e))) {
      for (; o !== null; ) {
        var s = Zs(o);
        if (
          (s !== null && Sm(s),
          (s = Nc(e, t, n, r)),
          s === null && _a(e, t, r, rl, n),
          s === o)
        )
          break;
        o = s;
      }
      o !== null && r.stopPropagation();
    } else _a(e, t, r, null, n);
  }
}
var rl = null;
function Nc(e, t, n, r) {
  if (((rl = null), (e = Bu(r)), (e = fr(e)), e !== null))
    if (((t = Fr(e)), t === null)) e = null;
    else if (((n = t.tag), n === 13)) {
      if (((e = pm(t)), e !== null)) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return ((rl = e), null);
}
function jm(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (qw()) {
        case Hu:
          return 1;
        case vm:
          return 4;
        case el:
        case Xw:
          return 16;
        case ym:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var Bn = null,
  Qu = null,
  Li = null;
function km() {
  if (Li) return Li;
  var e,
    t = Qu,
    n = t.length,
    r,
    o = "value" in Bn ? Bn.value : Bn.textContent,
    s = o.length;
  for (e = 0; e < n && t[e] === o[e]; e++);
  var i = n - e;
  for (r = 1; r <= i && t[n - r] === o[s - r]; r++);
  return (Li = o.slice(e, 1 < r ? 1 - r : void 0));
}
function Di(e) {
  var t = e.keyCode;
  return (
    "charCode" in e
      ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
      : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function hi() {
  return !0;
}
function Mf() {
  return !1;
}
function pt(e) {
  function t(n, r, o, s, i) {
    ((this._reactName = n),
      (this._targetInst = o),
      (this.type = r),
      (this.nativeEvent = s),
      (this.target = i),
      (this.currentTarget = null));
    for (var a in e)
      e.hasOwnProperty(a) && ((n = e[a]), (this[a] = n ? n(s) : s[a]));
    return (
      (this.isDefaultPrevented = (
        s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1
      )
        ? hi
        : Mf),
      (this.isPropagationStopped = Mf),
      this
    );
  }
  return (
    ge(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != "unknown" && (n.returnValue = !1),
          (this.isDefaultPrevented = hi));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
          (this.isPropagationStopped = hi));
      },
      persist: function () {},
      isPersistent: hi,
    }),
    t
  );
}
var Uo = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  Gu = pt(Uo),
  Xs = ge({}, Uo, { view: 0, detail: 0 }),
  u1 = pt(Xs),
  Ca,
  Na,
  ns,
  Fl = ge({}, Xs, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Yu,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget;
    },
    movementX: function (e) {
      return "movementX" in e
        ? e.movementX
        : (e !== ns &&
            (ns && e.type === "mousemove"
              ? ((Ca = e.screenX - ns.screenX), (Na = e.screenY - ns.screenY))
              : (Na = Ca = 0),
            (ns = e)),
          Ca);
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : Na;
    },
  }),
  Lf = pt(Fl),
  d1 = ge({}, Fl, { dataTransfer: 0 }),
  f1 = pt(d1),
  p1 = ge({}, Xs, { relatedTarget: 0 }),
  Ea = pt(p1),
  h1 = ge({}, Uo, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  m1 = pt(h1),
  g1 = ge({}, Uo, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    },
  }),
  v1 = pt(g1),
  y1 = ge({}, Uo, { data: 0 }),
  Df = pt(y1),
  x1 = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified",
  },
  w1 = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta",
  },
  S1 = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function b1(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = S1[e]) ? !!t[e] : !1;
}
function Yu() {
  return b1;
}
var C1 = ge({}, Xs, {
    key: function (e) {
      if (e.key) {
        var t = x1[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress"
        ? ((e = Di(e)), e === 13 ? "Enter" : String.fromCharCode(e))
        : e.type === "keydown" || e.type === "keyup"
          ? w1[e.keyCode] || "Unidentified"
          : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Yu,
    charCode: function (e) {
      return e.type === "keypress" ? Di(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress"
        ? Di(e)
        : e.type === "keydown" || e.type === "keyup"
          ? e.keyCode
          : 0;
    },
  }),
  N1 = pt(C1),
  E1 = ge({}, Fl, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  Ff = pt(E1),
  j1 = ge({}, Xs, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Yu,
  }),
  k1 = pt(j1),
  P1 = ge({}, Uo, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  T1 = pt(P1),
  R1 = ge({}, Fl, {
    deltaX: function (e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return "deltaY" in e
        ? e.deltaY
        : "wheelDeltaY" in e
          ? -e.wheelDeltaY
          : "wheelDelta" in e
            ? -e.wheelDelta
            : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  A1 = pt(R1),
  _1 = [9, 13, 27, 32],
  qu = hn && "CompositionEvent" in window,
  gs = null;
hn && "documentMode" in document && (gs = document.documentMode);
var O1 = hn && "TextEvent" in window && !gs,
  Pm = hn && (!qu || (gs && 8 < gs && 11 >= gs)),
  zf = " ",
  $f = !1;
function Tm(e, t) {
  switch (e) {
    case "keyup":
      return _1.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function Rm(e) {
  return ((e = e.detail), typeof e == "object" && "data" in e ? e.data : null);
}
var Kr = !1;
function I1(e, t) {
  switch (e) {
    case "compositionend":
      return Rm(t);
    case "keypress":
      return t.which !== 32 ? null : (($f = !0), zf);
    case "textInput":
      return ((e = t.data), e === zf && $f ? null : e);
    default:
      return null;
  }
}
function M1(e, t) {
  if (Kr)
    return e === "compositionend" || (!qu && Tm(e, t))
      ? ((e = km()), (Li = Qu = Bn = null), (Kr = !1), e)
      : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return Pm && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var L1 = {
  color: !0,
  date: !0,
  datetime: !0,
  "datetime-local": !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function Uf(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!L1[e.type] : t === "textarea";
}
function Am(e, t, n, r) {
  (am(r),
    (t = ol(t, "onChange")),
    0 < t.length &&
      ((n = new Gu("onChange", "change", null, n, r)),
      e.push({ event: n, listeners: t })));
}
var vs = null,
  Rs = null;
function D1(e) {
  Bm(e, 0);
}
function zl(e) {
  var t = Yr(e);
  if (tm(t)) return e;
}
function F1(e, t) {
  if (e === "change") return t;
}
var _m = !1;
if (hn) {
  var ja;
  if (hn) {
    var ka = "oninput" in document;
    if (!ka) {
      var Bf = document.createElement("div");
      (Bf.setAttribute("oninput", "return;"),
        (ka = typeof Bf.oninput == "function"));
    }
    ja = ka;
  } else ja = !1;
  _m = ja && (!document.documentMode || 9 < document.documentMode);
}
function Hf() {
  vs && (vs.detachEvent("onpropertychange", Om), (Rs = vs = null));
}
function Om(e) {
  if (e.propertyName === "value" && zl(Rs)) {
    var t = [];
    (Am(t, Rs, e, Bu(e)), fm(D1, t));
  }
}
function z1(e, t, n) {
  e === "focusin"
    ? (Hf(), (vs = t), (Rs = n), vs.attachEvent("onpropertychange", Om))
    : e === "focusout" && Hf();
}
function $1(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown")
    return zl(Rs);
}
function U1(e, t) {
  if (e === "click") return zl(t);
}
function B1(e, t) {
  if (e === "input" || e === "change") return zl(t);
}
function H1(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var It = typeof Object.is == "function" ? Object.is : H1;
function As(e, t) {
  if (It(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  var n = Object.keys(e),
    r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var o = n[r];
    if (!ic.call(t, o) || !It(e[o], t[o])) return !1;
  }
  return !0;
}
function Vf(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function Wf(e, t) {
  var n = Vf(e);
  e = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (((r = e + n.textContent.length), e <= t && r >= t))
        return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = Vf(n);
  }
}
function Im(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
        ? !1
        : t && t.nodeType === 3
          ? Im(e, t.parentNode)
          : "contains" in e
            ? e.contains(t)
            : e.compareDocumentPosition
              ? !!(e.compareDocumentPosition(t) & 16)
              : !1
    : !1;
}
function Mm() {
  for (var e = window, t = Xi(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = Xi(e.document);
  }
  return t;
}
function Xu(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return (
    t &&
    ((t === "input" &&
      (e.type === "text" ||
        e.type === "search" ||
        e.type === "tel" ||
        e.type === "url" ||
        e.type === "password")) ||
      t === "textarea" ||
      e.contentEditable === "true")
  );
}
function V1(e) {
  var t = Mm(),
    n = e.focusedElem,
    r = e.selectionRange;
  if (
    t !== n &&
    n &&
    n.ownerDocument &&
    Im(n.ownerDocument.documentElement, n)
  ) {
    if (r !== null && Xu(n)) {
      if (
        ((t = r.start),
        (e = r.end),
        e === void 0 && (e = t),
        "selectionStart" in n)
      )
        ((n.selectionStart = t),
          (n.selectionEnd = Math.min(e, n.value.length)));
      else if (
        ((e = ((t = n.ownerDocument || document) && t.defaultView) || window),
        e.getSelection)
      ) {
        e = e.getSelection();
        var o = n.textContent.length,
          s = Math.min(r.start, o);
        ((r = r.end === void 0 ? s : Math.min(r.end, o)),
          !e.extend && s > r && ((o = r), (r = s), (s = o)),
          (o = Wf(n, s)));
        var i = Wf(n, r);
        o &&
          i &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== o.node ||
            e.anchorOffset !== o.offset ||
            e.focusNode !== i.node ||
            e.focusOffset !== i.offset) &&
          ((t = t.createRange()),
          t.setStart(o.node, o.offset),
          e.removeAllRanges(),
          s > r
            ? (e.addRange(t), e.extend(i.node, i.offset))
            : (t.setEnd(i.node, i.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; (e = e.parentNode); )
      e.nodeType === 1 &&
        t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++)
      ((e = t[n]),
        (e.element.scrollLeft = e.left),
        (e.element.scrollTop = e.top));
  }
}
var W1 = hn && "documentMode" in document && 11 >= document.documentMode,
  Qr = null,
  Ec = null,
  ys = null,
  jc = !1;
function Kf(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  jc ||
    Qr == null ||
    Qr !== Xi(r) ||
    ((r = Qr),
    "selectionStart" in r && Xu(r)
      ? (r = { start: r.selectionStart, end: r.selectionEnd })
      : ((r = (
          (r.ownerDocument && r.ownerDocument.defaultView) ||
          window
        ).getSelection()),
        (r = {
          anchorNode: r.anchorNode,
          anchorOffset: r.anchorOffset,
          focusNode: r.focusNode,
          focusOffset: r.focusOffset,
        })),
    (ys && As(ys, r)) ||
      ((ys = r),
      (r = ol(Ec, "onSelect")),
      0 < r.length &&
        ((t = new Gu("onSelect", "select", null, t, n)),
        e.push({ event: t, listeners: r }),
        (t.target = Qr))));
}
function mi(e, t) {
  var n = {};
  return (
    (n[e.toLowerCase()] = t.toLowerCase()),
    (n["Webkit" + e] = "webkit" + t),
    (n["Moz" + e] = "moz" + t),
    n
  );
}
var Gr = {
    animationend: mi("Animation", "AnimationEnd"),
    animationiteration: mi("Animation", "AnimationIteration"),
    animationstart: mi("Animation", "AnimationStart"),
    transitionend: mi("Transition", "TransitionEnd"),
  },
  Pa = {},
  Lm = {};
hn &&
  ((Lm = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete Gr.animationend.animation,
    delete Gr.animationiteration.animation,
    delete Gr.animationstart.animation),
  "TransitionEvent" in window || delete Gr.transitionend.transition);
function $l(e) {
  if (Pa[e]) return Pa[e];
  if (!Gr[e]) return e;
  var t = Gr[e],
    n;
  for (n in t) if (t.hasOwnProperty(n) && n in Lm) return (Pa[e] = t[n]);
  return e;
}
var Dm = $l("animationend"),
  Fm = $l("animationiteration"),
  zm = $l("animationstart"),
  $m = $l("transitionend"),
  Um = new Map(),
  Qf =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " ",
    );
function or(e, t) {
  (Um.set(e, t), Dr(t, [e]));
}
for (var Ta = 0; Ta < Qf.length; Ta++) {
  var Ra = Qf[Ta],
    K1 = Ra.toLowerCase(),
    Q1 = Ra[0].toUpperCase() + Ra.slice(1);
  or(K1, "on" + Q1);
}
or(Dm, "onAnimationEnd");
or(Fm, "onAnimationIteration");
or(zm, "onAnimationStart");
or("dblclick", "onDoubleClick");
or("focusin", "onFocus");
or("focusout", "onBlur");
or($m, "onTransitionEnd");
ko("onMouseEnter", ["mouseout", "mouseover"]);
ko("onMouseLeave", ["mouseout", "mouseover"]);
ko("onPointerEnter", ["pointerout", "pointerover"]);
ko("onPointerLeave", ["pointerout", "pointerover"]);
Dr(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(
    " ",
  ),
);
Dr(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " ",
  ),
);
Dr("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
Dr(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" "),
);
Dr(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" "),
);
Dr(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
);
var ds =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " ",
    ),
  G1 = new Set("cancel close invalid load scroll toggle".split(" ").concat(ds));
function Gf(e, t, n) {
  var r = e.type || "unknown-event";
  ((e.currentTarget = n), Kw(r, t, void 0, e), (e.currentTarget = null));
}
function Bm(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n],
      o = r.event;
    r = r.listeners;
    e: {
      var s = void 0;
      if (t)
        for (var i = r.length - 1; 0 <= i; i--) {
          var a = r[i],
            c = a.instance,
            u = a.currentTarget;
          if (((a = a.listener), c !== s && o.isPropagationStopped())) break e;
          (Gf(o, a, u), (s = c));
        }
      else
        for (i = 0; i < r.length; i++) {
          if (
            ((a = r[i]),
            (c = a.instance),
            (u = a.currentTarget),
            (a = a.listener),
            c !== s && o.isPropagationStopped())
          )
            break e;
          (Gf(o, a, u), (s = c));
        }
    }
  }
  if (Ji) throw ((e = Sc), (Ji = !1), (Sc = null), e);
}
function de(e, t) {
  var n = t[Ac];
  n === void 0 && (n = t[Ac] = new Set());
  var r = e + "__bubble";
  n.has(r) || (Hm(t, e, 2, !1), n.add(r));
}
function Aa(e, t, n) {
  var r = 0;
  (t && (r |= 4), Hm(n, e, r, t));
}
var gi = "_reactListening" + Math.random().toString(36).slice(2);
function _s(e) {
  if (!e[gi]) {
    ((e[gi] = !0),
      qh.forEach(function (n) {
        n !== "selectionchange" && (G1.has(n) || Aa(n, !1, e), Aa(n, !0, e));
      }));
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[gi] || ((t[gi] = !0), Aa("selectionchange", !1, t));
  }
}
function Hm(e, t, n, r) {
  switch (jm(t)) {
    case 1:
      var o = a1;
      break;
    case 4:
      o = c1;
      break;
    default:
      o = Ku;
  }
  ((n = o.bind(null, t, n, e)),
    (o = void 0),
    !wc ||
      (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
      (o = !0),
    r
      ? o !== void 0
        ? e.addEventListener(t, n, { capture: !0, passive: o })
        : e.addEventListener(t, n, !0)
      : o !== void 0
        ? e.addEventListener(t, n, { passive: o })
        : e.addEventListener(t, n, !1));
}
function _a(e, t, n, r, o) {
  var s = r;
  if (!(t & 1) && !(t & 2) && r !== null)
    e: for (;;) {
      if (r === null) return;
      var i = r.tag;
      if (i === 3 || i === 4) {
        var a = r.stateNode.containerInfo;
        if (a === o || (a.nodeType === 8 && a.parentNode === o)) break;
        if (i === 4)
          for (i = r.return; i !== null; ) {
            var c = i.tag;
            if (
              (c === 3 || c === 4) &&
              ((c = i.stateNode.containerInfo),
              c === o || (c.nodeType === 8 && c.parentNode === o))
            )
              return;
            i = i.return;
          }
        for (; a !== null; ) {
          if (((i = fr(a)), i === null)) return;
          if (((c = i.tag), c === 5 || c === 6)) {
            r = s = i;
            continue e;
          }
          a = a.parentNode;
        }
      }
      r = r.return;
    }
  fm(function () {
    var u = s,
      d = Bu(n),
      p = [];
    e: {
      var h = Um.get(e);
      if (h !== void 0) {
        var x = Gu,
          S = e;
        switch (e) {
          case "keypress":
            if (Di(n) === 0) break e;
          case "keydown":
          case "keyup":
            x = N1;
            break;
          case "focusin":
            ((S = "focus"), (x = Ea));
            break;
          case "focusout":
            ((S = "blur"), (x = Ea));
            break;
          case "beforeblur":
          case "afterblur":
            x = Ea;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            x = Lf;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            x = f1;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            x = k1;
            break;
          case Dm:
          case Fm:
          case zm:
            x = m1;
            break;
          case $m:
            x = T1;
            break;
          case "scroll":
            x = u1;
            break;
          case "wheel":
            x = A1;
            break;
          case "copy":
          case "cut":
          case "paste":
            x = v1;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            x = Ff;
        }
        var v = (t & 4) !== 0,
          w = !v && e === "scroll",
          g = v ? (h !== null ? h + "Capture" : null) : h;
        v = [];
        for (var m = u, y; m !== null; ) {
          y = m;
          var b = y.stateNode;
          if (
            (y.tag === 5 &&
              b !== null &&
              ((y = b),
              g !== null && ((b = js(m, g)), b != null && v.push(Os(m, b, y)))),
            w)
          )
            break;
          m = m.return;
        }
        0 < v.length &&
          ((h = new x(h, S, null, n, d)), p.push({ event: h, listeners: v }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (
          ((h = e === "mouseover" || e === "pointerover"),
          (x = e === "mouseout" || e === "pointerout"),
          h &&
            n !== yc &&
            (S = n.relatedTarget || n.fromElement) &&
            (fr(S) || S[mn]))
        )
          break e;
        if (
          (x || h) &&
          ((h =
            d.window === d
              ? d
              : (h = d.ownerDocument)
                ? h.defaultView || h.parentWindow
                : window),
          x
            ? ((S = n.relatedTarget || n.toElement),
              (x = u),
              (S = S ? fr(S) : null),
              S !== null &&
                ((w = Fr(S)), S !== w || (S.tag !== 5 && S.tag !== 6)) &&
                (S = null))
            : ((x = null), (S = u)),
          x !== S)
        ) {
          if (
            ((v = Lf),
            (b = "onMouseLeave"),
            (g = "onMouseEnter"),
            (m = "mouse"),
            (e === "pointerout" || e === "pointerover") &&
              ((v = Ff),
              (b = "onPointerLeave"),
              (g = "onPointerEnter"),
              (m = "pointer")),
            (w = x == null ? h : Yr(x)),
            (y = S == null ? h : Yr(S)),
            (h = new v(b, m + "leave", x, n, d)),
            (h.target = w),
            (h.relatedTarget = y),
            (b = null),
            fr(d) === u &&
              ((v = new v(g, m + "enter", S, n, d)),
              (v.target = y),
              (v.relatedTarget = w),
              (b = v)),
            (w = b),
            x && S)
          )
            t: {
              for (v = x, g = S, m = 0, y = v; y; y = $r(y)) m++;
              for (y = 0, b = g; b; b = $r(b)) y++;
              for (; 0 < m - y; ) ((v = $r(v)), m--);
              for (; 0 < y - m; ) ((g = $r(g)), y--);
              for (; m--; ) {
                if (v === g || (g !== null && v === g.alternate)) break t;
                ((v = $r(v)), (g = $r(g)));
              }
              v = null;
            }
          else v = null;
          (x !== null && Yf(p, h, x, v, !1),
            S !== null && w !== null && Yf(p, w, S, v, !0));
        }
      }
      e: {
        if (
          ((h = u ? Yr(u) : window),
          (x = h.nodeName && h.nodeName.toLowerCase()),
          x === "select" || (x === "input" && h.type === "file"))
        )
          var E = F1;
        else if (Uf(h))
          if (_m) E = B1;
          else {
            E = $1;
            var k = z1;
          }
        else
          (x = h.nodeName) &&
            x.toLowerCase() === "input" &&
            (h.type === "checkbox" || h.type === "radio") &&
            (E = U1);
        if (E && (E = E(e, u))) {
          Am(p, E, n, d);
          break e;
        }
        (k && k(e, h, u),
          e === "focusout" &&
            (k = h._wrapperState) &&
            k.controlled &&
            h.type === "number" &&
            pc(h, "number", h.value));
      }
      switch (((k = u ? Yr(u) : window), e)) {
        case "focusin":
          (Uf(k) || k.contentEditable === "true") &&
            ((Qr = k), (Ec = u), (ys = null));
          break;
        case "focusout":
          ys = Ec = Qr = null;
          break;
        case "mousedown":
          jc = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          ((jc = !1), Kf(p, n, d));
          break;
        case "selectionchange":
          if (W1) break;
        case "keydown":
        case "keyup":
          Kf(p, n, d);
      }
      var N;
      if (qu)
        e: {
          switch (e) {
            case "compositionstart":
              var j = "onCompositionStart";
              break e;
            case "compositionend":
              j = "onCompositionEnd";
              break e;
            case "compositionupdate":
              j = "onCompositionUpdate";
              break e;
          }
          j = void 0;
        }
      else
        Kr
          ? Tm(e, n) && (j = "onCompositionEnd")
          : e === "keydown" && n.keyCode === 229 && (j = "onCompositionStart");
      (j &&
        (Pm &&
          n.locale !== "ko" &&
          (Kr || j !== "onCompositionStart"
            ? j === "onCompositionEnd" && Kr && (N = km())
            : ((Bn = d),
              (Qu = "value" in Bn ? Bn.value : Bn.textContent),
              (Kr = !0))),
        (k = ol(u, j)),
        0 < k.length &&
          ((j = new Df(j, e, null, n, d)),
          p.push({ event: j, listeners: k }),
          N ? (j.data = N) : ((N = Rm(n)), N !== null && (j.data = N)))),
        (N = O1 ? I1(e, n) : M1(e, n)) &&
          ((u = ol(u, "onBeforeInput")),
          0 < u.length &&
            ((d = new Df("onBeforeInput", "beforeinput", null, n, d)),
            p.push({ event: d, listeners: u }),
            (d.data = N))));
    }
    Bm(p, t);
  });
}
function Os(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function ol(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var o = e,
      s = o.stateNode;
    (o.tag === 5 &&
      s !== null &&
      ((o = s),
      (s = js(e, n)),
      s != null && r.unshift(Os(e, s, o)),
      (s = js(e, t)),
      s != null && r.push(Os(e, s, o))),
      (e = e.return));
  }
  return r;
}
function $r(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function Yf(e, t, n, r, o) {
  for (var s = t._reactName, i = []; n !== null && n !== r; ) {
    var a = n,
      c = a.alternate,
      u = a.stateNode;
    if (c !== null && c === r) break;
    (a.tag === 5 &&
      u !== null &&
      ((a = u),
      o
        ? ((c = js(n, s)), c != null && i.unshift(Os(n, c, a)))
        : o || ((c = js(n, s)), c != null && i.push(Os(n, c, a)))),
      (n = n.return));
  }
  i.length !== 0 && e.push({ event: t, listeners: i });
}
var Y1 = /\r\n?/g,
  q1 = /\u0000|\uFFFD/g;
function qf(e) {
  return (typeof e == "string" ? e : "" + e)
    .replace(
      Y1,
      `
`,
    )
    .replace(q1, "");
}
function vi(e, t, n) {
  if (((t = qf(t)), qf(e) !== t && n)) throw Error(A(425));
}
function sl() {}
var kc = null,
  Pc = null;
function Tc(e, t) {
  return (
    e === "textarea" ||
    e === "noscript" ||
    typeof t.children == "string" ||
    typeof t.children == "number" ||
    (typeof t.dangerouslySetInnerHTML == "object" &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  );
}
var Rc = typeof setTimeout == "function" ? setTimeout : void 0,
  X1 = typeof clearTimeout == "function" ? clearTimeout : void 0,
  Xf = typeof Promise == "function" ? Promise : void 0,
  Z1 =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof Xf < "u"
        ? function (e) {
            return Xf.resolve(null).then(e).catch(J1);
          }
        : Rc;
function J1(e) {
  setTimeout(function () {
    throw e;
  });
}
function Oa(e, t) {
  var n = t,
    r = 0;
  do {
    var o = n.nextSibling;
    if ((e.removeChild(n), o && o.nodeType === 8))
      if (((n = o.data), n === "/$")) {
        if (r === 0) {
          (e.removeChild(o), Ts(t));
          return;
        }
        r--;
      } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
    n = o;
  } while (n);
  Ts(t);
}
function Qn(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break;
      if (t === "/$") return null;
    }
  }
  return e;
}
function Zf(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (t === 0) return e;
        t--;
      } else n === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var Bo = Math.random().toString(36).slice(2),
  Qt = "__reactFiber$" + Bo,
  Is = "__reactProps$" + Bo,
  mn = "__reactContainer$" + Bo,
  Ac = "__reactEvents$" + Bo,
  eS = "__reactListeners$" + Bo,
  tS = "__reactHandles$" + Bo;
function fr(e) {
  var t = e[Qt];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if ((t = n[mn] || n[Qt])) {
      if (
        ((n = t.alternate),
        t.child !== null || (n !== null && n.child !== null))
      )
        for (e = Zf(e); e !== null; ) {
          if ((n = e[Qt])) return n;
          e = Zf(e);
        }
      return t;
    }
    ((e = n), (n = e.parentNode));
  }
  return null;
}
function Zs(e) {
  return (
    (e = e[Qt] || e[mn]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function Yr(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(A(33));
}
function Ul(e) {
  return e[Is] || null;
}
var _c = [],
  qr = -1;
function sr(e) {
  return { current: e };
}
function fe(e) {
  0 > qr || ((e.current = _c[qr]), (_c[qr] = null), qr--);
}
function ae(e, t) {
  (qr++, (_c[qr] = e.current), (e.current = t));
}
var er = {},
  Ue = sr(er),
  tt = sr(!1),
  jr = er;
function Po(e, t) {
  var n = e.type.contextTypes;
  if (!n) return er;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
    return r.__reactInternalMemoizedMaskedChildContext;
  var o = {},
    s;
  for (s in n) o[s] = t[s];
  return (
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = o)),
    o
  );
}
function nt(e) {
  return ((e = e.childContextTypes), e != null);
}
function il() {
  (fe(tt), fe(Ue));
}
function Jf(e, t, n) {
  if (Ue.current !== er) throw Error(A(168));
  (ae(Ue, t), ae(tt, n));
}
function Vm(e, t, n) {
  var r = e.stateNode;
  if (((t = t.childContextTypes), typeof r.getChildContext != "function"))
    return n;
  r = r.getChildContext();
  for (var o in r) if (!(o in t)) throw Error(A(108, zw(e) || "Unknown", o));
  return ge({}, n, r);
}
function ll(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || er),
    (jr = Ue.current),
    ae(Ue, e),
    ae(tt, tt.current),
    !0
  );
}
function ep(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(A(169));
  (n
    ? ((e = Vm(e, t, jr)),
      (r.__reactInternalMemoizedMergedChildContext = e),
      fe(tt),
      fe(Ue),
      ae(Ue, e))
    : fe(tt),
    ae(tt, n));
}
var ln = null,
  Bl = !1,
  Ia = !1;
function Wm(e) {
  ln === null ? (ln = [e]) : ln.push(e);
}
function nS(e) {
  ((Bl = !0), Wm(e));
}
function ir() {
  if (!Ia && ln !== null) {
    Ia = !0;
    var e = 0,
      t = re;
    try {
      var n = ln;
      for (re = 1; e < n.length; e++) {
        var r = n[e];
        do r = r(!0);
        while (r !== null);
      }
      ((ln = null), (Bl = !1));
    } catch (o) {
      throw (ln !== null && (ln = ln.slice(e + 1)), gm(Hu, ir), o);
    } finally {
      ((re = t), (Ia = !1));
    }
  }
  return null;
}
var Xr = [],
  Zr = 0,
  al = null,
  cl = 0,
  gt = [],
  vt = 0,
  kr = null,
  un = 1,
  dn = "";
function cr(e, t) {
  ((Xr[Zr++] = cl), (Xr[Zr++] = al), (al = e), (cl = t));
}
function Km(e, t, n) {
  ((gt[vt++] = un), (gt[vt++] = dn), (gt[vt++] = kr), (kr = e));
  var r = un;
  e = dn;
  var o = 32 - At(r) - 1;
  ((r &= ~(1 << o)), (n += 1));
  var s = 32 - At(t) + o;
  if (30 < s) {
    var i = o - (o % 5);
    ((s = (r & ((1 << i) - 1)).toString(32)),
      (r >>= i),
      (o -= i),
      (un = (1 << (32 - At(t) + o)) | (n << o) | r),
      (dn = s + e));
  } else ((un = (1 << s) | (n << o) | r), (dn = e));
}
function Zu(e) {
  e.return !== null && (cr(e, 1), Km(e, 1, 0));
}
function Ju(e) {
  for (; e === al; )
    ((al = Xr[--Zr]), (Xr[Zr] = null), (cl = Xr[--Zr]), (Xr[Zr] = null));
  for (; e === kr; )
    ((kr = gt[--vt]),
      (gt[vt] = null),
      (dn = gt[--vt]),
      (gt[vt] = null),
      (un = gt[--vt]),
      (gt[vt] = null));
}
var ct = null,
  at = null,
  pe = !1,
  Tt = null;
function Qm(e, t) {
  var n = yt(5, null, null, 0);
  ((n.elementType = "DELETED"),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n));
}
function tp(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (
        (t =
          t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase()
            ? null
            : t),
        t !== null
          ? ((e.stateNode = t), (ct = e), (at = Qn(t.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (ct = e), (at = null), !0) : !1
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = kr !== null ? { id: un, overflow: dn } : null),
            (e.memoizedState = {
              dehydrated: t,
              treeContext: n,
              retryLane: 1073741824,
            }),
            (n = yt(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (ct = e),
            (at = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function Oc(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Ic(e) {
  if (pe) {
    var t = at;
    if (t) {
      var n = t;
      if (!tp(e, t)) {
        if (Oc(e)) throw Error(A(418));
        t = Qn(n.nextSibling);
        var r = ct;
        t && tp(e, t)
          ? Qm(r, n)
          : ((e.flags = (e.flags & -4097) | 2), (pe = !1), (ct = e));
      }
    } else {
      if (Oc(e)) throw Error(A(418));
      ((e.flags = (e.flags & -4097) | 2), (pe = !1), (ct = e));
    }
  }
}
function np(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
    e = e.return;
  ct = e;
}
function yi(e) {
  if (e !== ct) return !1;
  if (!pe) return (np(e), (pe = !0), !1);
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type),
      (t = t !== "head" && t !== "body" && !Tc(e.type, e.memoizedProps))),
    t && (t = at))
  ) {
    if (Oc(e)) throw (Gm(), Error(A(418)));
    for (; t; ) (Qm(e, t), (t = Qn(t.nextSibling)));
  }
  if ((np(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(A(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              at = Qn(e.nextSibling);
              break e;
            }
            t--;
          } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
        }
        e = e.nextSibling;
      }
      at = null;
    }
  } else at = ct ? Qn(e.stateNode.nextSibling) : null;
  return !0;
}
function Gm() {
  for (var e = at; e; ) e = Qn(e.nextSibling);
}
function To() {
  ((at = ct = null), (pe = !1));
}
function ed(e) {
  Tt === null ? (Tt = [e]) : Tt.push(e);
}
var rS = Sn.ReactCurrentBatchConfig;
function rs(e, t, n) {
  if (
    ((e = n.ref), e !== null && typeof e != "function" && typeof e != "object")
  ) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(A(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(A(147, e));
      var o = r,
        s = "" + e;
      return t !== null &&
        t.ref !== null &&
        typeof t.ref == "function" &&
        t.ref._stringRef === s
        ? t.ref
        : ((t = function (i) {
            var a = o.refs;
            i === null ? delete a[s] : (a[s] = i);
          }),
          (t._stringRef = s),
          t);
    }
    if (typeof e != "string") throw Error(A(284));
    if (!n._owner) throw Error(A(290, e));
  }
  return e;
}
function xi(e, t) {
  throw (
    (e = Object.prototype.toString.call(t)),
    Error(
      A(
        31,
        e === "[object Object]"
          ? "object with keys {" + Object.keys(t).join(", ") + "}"
          : e,
      ),
    )
  );
}
function rp(e) {
  var t = e._init;
  return t(e._payload);
}
function Ym(e) {
  function t(g, m) {
    if (e) {
      var y = g.deletions;
      y === null ? ((g.deletions = [m]), (g.flags |= 16)) : y.push(m);
    }
  }
  function n(g, m) {
    if (!e) return null;
    for (; m !== null; ) (t(g, m), (m = m.sibling));
    return null;
  }
  function r(g, m) {
    for (g = new Map(); m !== null; )
      (m.key !== null ? g.set(m.key, m) : g.set(m.index, m), (m = m.sibling));
    return g;
  }
  function o(g, m) {
    return ((g = Xn(g, m)), (g.index = 0), (g.sibling = null), g);
  }
  function s(g, m, y) {
    return (
      (g.index = y),
      e
        ? ((y = g.alternate),
          y !== null
            ? ((y = y.index), y < m ? ((g.flags |= 2), m) : y)
            : ((g.flags |= 2), m))
        : ((g.flags |= 1048576), m)
    );
  }
  function i(g) {
    return (e && g.alternate === null && (g.flags |= 2), g);
  }
  function a(g, m, y, b) {
    return m === null || m.tag !== 6
      ? ((m = Ua(y, g.mode, b)), (m.return = g), m)
      : ((m = o(m, y)), (m.return = g), m);
  }
  function c(g, m, y, b) {
    var E = y.type;
    return E === Wr
      ? d(g, m, y.props.children, b, y.key)
      : m !== null &&
          (m.elementType === E ||
            (typeof E == "object" &&
              E !== null &&
              E.$$typeof === Tn &&
              rp(E) === m.type))
        ? ((b = o(m, y.props)), (b.ref = rs(g, m, y)), (b.return = g), b)
        : ((b = Vi(y.type, y.key, y.props, null, g.mode, b)),
          (b.ref = rs(g, m, y)),
          (b.return = g),
          b);
  }
  function u(g, m, y, b) {
    return m === null ||
      m.tag !== 4 ||
      m.stateNode.containerInfo !== y.containerInfo ||
      m.stateNode.implementation !== y.implementation
      ? ((m = Ba(y, g.mode, b)), (m.return = g), m)
      : ((m = o(m, y.children || [])), (m.return = g), m);
  }
  function d(g, m, y, b, E) {
    return m === null || m.tag !== 7
      ? ((m = Er(y, g.mode, b, E)), (m.return = g), m)
      : ((m = o(m, y)), (m.return = g), m);
  }
  function p(g, m, y) {
    if ((typeof m == "string" && m !== "") || typeof m == "number")
      return ((m = Ua("" + m, g.mode, y)), (m.return = g), m);
    if (typeof m == "object" && m !== null) {
      switch (m.$$typeof) {
        case ai:
          return (
            (y = Vi(m.type, m.key, m.props, null, g.mode, y)),
            (y.ref = rs(g, null, m)),
            (y.return = g),
            y
          );
        case Vr:
          return ((m = Ba(m, g.mode, y)), (m.return = g), m);
        case Tn:
          var b = m._init;
          return p(g, b(m._payload), y);
      }
      if (cs(m) || Zo(m))
        return ((m = Er(m, g.mode, y, null)), (m.return = g), m);
      xi(g, m);
    }
    return null;
  }
  function h(g, m, y, b) {
    var E = m !== null ? m.key : null;
    if ((typeof y == "string" && y !== "") || typeof y == "number")
      return E !== null ? null : a(g, m, "" + y, b);
    if (typeof y == "object" && y !== null) {
      switch (y.$$typeof) {
        case ai:
          return y.key === E ? c(g, m, y, b) : null;
        case Vr:
          return y.key === E ? u(g, m, y, b) : null;
        case Tn:
          return ((E = y._init), h(g, m, E(y._payload), b));
      }
      if (cs(y) || Zo(y)) return E !== null ? null : d(g, m, y, b, null);
      xi(g, y);
    }
    return null;
  }
  function x(g, m, y, b, E) {
    if ((typeof b == "string" && b !== "") || typeof b == "number")
      return ((g = g.get(y) || null), a(m, g, "" + b, E));
    if (typeof b == "object" && b !== null) {
      switch (b.$$typeof) {
        case ai:
          return (
            (g = g.get(b.key === null ? y : b.key) || null),
            c(m, g, b, E)
          );
        case Vr:
          return (
            (g = g.get(b.key === null ? y : b.key) || null),
            u(m, g, b, E)
          );
        case Tn:
          var k = b._init;
          return x(g, m, y, k(b._payload), E);
      }
      if (cs(b) || Zo(b)) return ((g = g.get(y) || null), d(m, g, b, E, null));
      xi(m, b);
    }
    return null;
  }
  function S(g, m, y, b) {
    for (
      var E = null, k = null, N = m, j = (m = 0), P = null;
      N !== null && j < y.length;
      j++
    ) {
      N.index > j ? ((P = N), (N = null)) : (P = N.sibling);
      var R = h(g, N, y[j], b);
      if (R === null) {
        N === null && (N = P);
        break;
      }
      (e && N && R.alternate === null && t(g, N),
        (m = s(R, m, j)),
        k === null ? (E = R) : (k.sibling = R),
        (k = R),
        (N = P));
    }
    if (j === y.length) return (n(g, N), pe && cr(g, j), E);
    if (N === null) {
      for (; j < y.length; j++)
        ((N = p(g, y[j], b)),
          N !== null &&
            ((m = s(N, m, j)),
            k === null ? (E = N) : (k.sibling = N),
            (k = N)));
      return (pe && cr(g, j), E);
    }
    for (N = r(g, N); j < y.length; j++)
      ((P = x(N, g, j, y[j], b)),
        P !== null &&
          (e && P.alternate !== null && N.delete(P.key === null ? j : P.key),
          (m = s(P, m, j)),
          k === null ? (E = P) : (k.sibling = P),
          (k = P)));
    return (
      e &&
        N.forEach(function (M) {
          return t(g, M);
        }),
      pe && cr(g, j),
      E
    );
  }
  function v(g, m, y, b) {
    var E = Zo(y);
    if (typeof E != "function") throw Error(A(150));
    if (((y = E.call(y)), y == null)) throw Error(A(151));
    for (
      var k = (E = null), N = m, j = (m = 0), P = null, R = y.next();
      N !== null && !R.done;
      j++, R = y.next()
    ) {
      N.index > j ? ((P = N), (N = null)) : (P = N.sibling);
      var M = h(g, N, R.value, b);
      if (M === null) {
        N === null && (N = P);
        break;
      }
      (e && N && M.alternate === null && t(g, N),
        (m = s(M, m, j)),
        k === null ? (E = M) : (k.sibling = M),
        (k = M),
        (N = P));
    }
    if (R.done) return (n(g, N), pe && cr(g, j), E);
    if (N === null) {
      for (; !R.done; j++, R = y.next())
        ((R = p(g, R.value, b)),
          R !== null &&
            ((m = s(R, m, j)),
            k === null ? (E = R) : (k.sibling = R),
            (k = R)));
      return (pe && cr(g, j), E);
    }
    for (N = r(g, N); !R.done; j++, R = y.next())
      ((R = x(N, g, j, R.value, b)),
        R !== null &&
          (e && R.alternate !== null && N.delete(R.key === null ? j : R.key),
          (m = s(R, m, j)),
          k === null ? (E = R) : (k.sibling = R),
          (k = R)));
    return (
      e &&
        N.forEach(function (I) {
          return t(g, I);
        }),
      pe && cr(g, j),
      E
    );
  }
  function w(g, m, y, b) {
    if (
      (typeof y == "object" &&
        y !== null &&
        y.type === Wr &&
        y.key === null &&
        (y = y.props.children),
      typeof y == "object" && y !== null)
    ) {
      switch (y.$$typeof) {
        case ai:
          e: {
            for (var E = y.key, k = m; k !== null; ) {
              if (k.key === E) {
                if (((E = y.type), E === Wr)) {
                  if (k.tag === 7) {
                    (n(g, k.sibling),
                      (m = o(k, y.props.children)),
                      (m.return = g),
                      (g = m));
                    break e;
                  }
                } else if (
                  k.elementType === E ||
                  (typeof E == "object" &&
                    E !== null &&
                    E.$$typeof === Tn &&
                    rp(E) === k.type)
                ) {
                  (n(g, k.sibling),
                    (m = o(k, y.props)),
                    (m.ref = rs(g, k, y)),
                    (m.return = g),
                    (g = m));
                  break e;
                }
                n(g, k);
                break;
              } else t(g, k);
              k = k.sibling;
            }
            y.type === Wr
              ? ((m = Er(y.props.children, g.mode, b, y.key)),
                (m.return = g),
                (g = m))
              : ((b = Vi(y.type, y.key, y.props, null, g.mode, b)),
                (b.ref = rs(g, m, y)),
                (b.return = g),
                (g = b));
          }
          return i(g);
        case Vr:
          e: {
            for (k = y.key; m !== null; ) {
              if (m.key === k)
                if (
                  m.tag === 4 &&
                  m.stateNode.containerInfo === y.containerInfo &&
                  m.stateNode.implementation === y.implementation
                ) {
                  (n(g, m.sibling),
                    (m = o(m, y.children || [])),
                    (m.return = g),
                    (g = m));
                  break e;
                } else {
                  n(g, m);
                  break;
                }
              else t(g, m);
              m = m.sibling;
            }
            ((m = Ba(y, g.mode, b)), (m.return = g), (g = m));
          }
          return i(g);
        case Tn:
          return ((k = y._init), w(g, m, k(y._payload), b));
      }
      if (cs(y)) return S(g, m, y, b);
      if (Zo(y)) return v(g, m, y, b);
      xi(g, y);
    }
    return (typeof y == "string" && y !== "") || typeof y == "number"
      ? ((y = "" + y),
        m !== null && m.tag === 6
          ? (n(g, m.sibling), (m = o(m, y)), (m.return = g), (g = m))
          : (n(g, m), (m = Ua(y, g.mode, b)), (m.return = g), (g = m)),
        i(g))
      : n(g, m);
  }
  return w;
}
var Ro = Ym(!0),
  qm = Ym(!1),
  ul = sr(null),
  dl = null,
  Jr = null,
  td = null;
function nd() {
  td = Jr = dl = null;
}
function rd(e) {
  var t = ul.current;
  (fe(ul), (e._currentValue = t));
}
function Mc(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if (
      ((e.childLanes & t) !== t
        ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
        : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
      e === n)
    )
      break;
    e = e.return;
  }
}
function io(e, t) {
  ((dl = e),
    (td = Jr = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      (e.lanes & t && (et = !0), (e.firstContext = null)));
}
function St(e) {
  var t = e._currentValue;
  if (td !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), Jr === null)) {
      if (dl === null) throw Error(A(308));
      ((Jr = e), (dl.dependencies = { lanes: 0, firstContext: e }));
    } else Jr = Jr.next = e;
  return t;
}
var pr = null;
function od(e) {
  pr === null ? (pr = [e]) : pr.push(e);
}
function Xm(e, t, n, r) {
  var o = t.interleaved;
  return (
    o === null ? ((n.next = n), od(t)) : ((n.next = o.next), (o.next = n)),
    (t.interleaved = n),
    gn(e, r)
  );
}
function gn(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; )
    ((e.childLanes |= t),
      (n = e.alternate),
      n !== null && (n.childLanes |= t),
      (n = e),
      (e = e.return));
  return n.tag === 3 ? n.stateNode : null;
}
var Rn = !1;
function sd(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function Zm(e, t) {
  ((e = e.updateQueue),
    t.updateQueue === e &&
      (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      }));
}
function fn(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function Gn(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), ee & 2)) {
    var o = r.pending;
    return (
      o === null ? (t.next = t) : ((t.next = o.next), (o.next = t)),
      (r.pending = t),
      gn(e, n)
    );
  }
  return (
    (o = r.interleaved),
    o === null ? ((t.next = t), od(r)) : ((t.next = o.next), (o.next = t)),
    (r.interleaved = t),
    gn(e, n)
  );
}
function Fi(e, t, n) {
  if (
    ((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))
  ) {
    var r = t.lanes;
    ((r &= e.pendingLanes), (n |= r), (t.lanes = n), Vu(e, n));
  }
}
function op(e, t) {
  var n = e.updateQueue,
    r = e.alternate;
  if (r !== null && ((r = r.updateQueue), n === r)) {
    var o = null,
      s = null;
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var i = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        };
        (s === null ? (o = s = i) : (s = s.next = i), (n = n.next));
      } while (n !== null);
      s === null ? (o = s = t) : (s = s.next = t);
    } else o = s = t;
    ((n = {
      baseState: r.baseState,
      firstBaseUpdate: o,
      lastBaseUpdate: s,
      shared: r.shared,
      effects: r.effects,
    }),
      (e.updateQueue = n));
    return;
  }
  ((e = n.lastBaseUpdate),
    e === null ? (n.firstBaseUpdate = t) : (e.next = t),
    (n.lastBaseUpdate = t));
}
function fl(e, t, n, r) {
  var o = e.updateQueue;
  Rn = !1;
  var s = o.firstBaseUpdate,
    i = o.lastBaseUpdate,
    a = o.shared.pending;
  if (a !== null) {
    o.shared.pending = null;
    var c = a,
      u = c.next;
    ((c.next = null), i === null ? (s = u) : (i.next = u), (i = c));
    var d = e.alternate;
    d !== null &&
      ((d = d.updateQueue),
      (a = d.lastBaseUpdate),
      a !== i &&
        (a === null ? (d.firstBaseUpdate = u) : (a.next = u),
        (d.lastBaseUpdate = c)));
  }
  if (s !== null) {
    var p = o.baseState;
    ((i = 0), (d = u = c = null), (a = s));
    do {
      var h = a.lane,
        x = a.eventTime;
      if ((r & h) === h) {
        d !== null &&
          (d = d.next =
            {
              eventTime: x,
              lane: 0,
              tag: a.tag,
              payload: a.payload,
              callback: a.callback,
              next: null,
            });
        e: {
          var S = e,
            v = a;
          switch (((h = t), (x = n), v.tag)) {
            case 1:
              if (((S = v.payload), typeof S == "function")) {
                p = S.call(x, p, h);
                break e;
              }
              p = S;
              break e;
            case 3:
              S.flags = (S.flags & -65537) | 128;
            case 0:
              if (
                ((S = v.payload),
                (h = typeof S == "function" ? S.call(x, p, h) : S),
                h == null)
              )
                break e;
              p = ge({}, p, h);
              break e;
            case 2:
              Rn = !0;
          }
        }
        a.callback !== null &&
          a.lane !== 0 &&
          ((e.flags |= 64),
          (h = o.effects),
          h === null ? (o.effects = [a]) : h.push(a));
      } else
        ((x = {
          eventTime: x,
          lane: h,
          tag: a.tag,
          payload: a.payload,
          callback: a.callback,
          next: null,
        }),
          d === null ? ((u = d = x), (c = p)) : (d = d.next = x),
          (i |= h));
      if (((a = a.next), a === null)) {
        if (((a = o.shared.pending), a === null)) break;
        ((h = a),
          (a = h.next),
          (h.next = null),
          (o.lastBaseUpdate = h),
          (o.shared.pending = null));
      }
    } while (!0);
    if (
      (d === null && (c = p),
      (o.baseState = c),
      (o.firstBaseUpdate = u),
      (o.lastBaseUpdate = d),
      (t = o.shared.interleaved),
      t !== null)
    ) {
      o = t;
      do ((i |= o.lane), (o = o.next));
      while (o !== t);
    } else s === null && (o.shared.lanes = 0);
    ((Tr |= i), (e.lanes = i), (e.memoizedState = p));
  }
}
function sp(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var r = e[t],
        o = r.callback;
      if (o !== null) {
        if (((r.callback = null), (r = n), typeof o != "function"))
          throw Error(A(191, o));
        o.call(r);
      }
    }
}
var Js = {},
  qt = sr(Js),
  Ms = sr(Js),
  Ls = sr(Js);
function hr(e) {
  if (e === Js) throw Error(A(174));
  return e;
}
function id(e, t) {
  switch ((ae(Ls, t), ae(Ms, e), ae(qt, Js), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : mc(null, "");
      break;
    default:
      ((e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = mc(t, e)));
  }
  (fe(qt), ae(qt, t));
}
function Ao() {
  (fe(qt), fe(Ms), fe(Ls));
}
function Jm(e) {
  hr(Ls.current);
  var t = hr(qt.current),
    n = mc(t, e.type);
  t !== n && (ae(Ms, e), ae(qt, n));
}
function ld(e) {
  Ms.current === e && (fe(qt), fe(Ms));
}
var he = sr(0);
function pl(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (
        n !== null &&
        ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!")
      )
        return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      ((t.child.return = t), (t = t.child));
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    ((t.sibling.return = t.return), (t = t.sibling));
  }
  return null;
}
var Ma = [];
function ad() {
  for (var e = 0; e < Ma.length; e++)
    Ma[e]._workInProgressVersionPrimary = null;
  Ma.length = 0;
}
var zi = Sn.ReactCurrentDispatcher,
  La = Sn.ReactCurrentBatchConfig,
  Pr = 0,
  me = null,
  Ee = null,
  Pe = null,
  hl = !1,
  xs = !1,
  Ds = 0,
  oS = 0;
function De() {
  throw Error(A(321));
}
function cd(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++)
    if (!It(e[n], t[n])) return !1;
  return !0;
}
function ud(e, t, n, r, o, s) {
  if (
    ((Pr = s),
    (me = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (zi.current = e === null || e.memoizedState === null ? aS : cS),
    (e = n(r, o)),
    xs)
  ) {
    s = 0;
    do {
      if (((xs = !1), (Ds = 0), 25 <= s)) throw Error(A(301));
      ((s += 1),
        (Pe = Ee = null),
        (t.updateQueue = null),
        (zi.current = uS),
        (e = n(r, o)));
    } while (xs);
  }
  if (
    ((zi.current = ml),
    (t = Ee !== null && Ee.next !== null),
    (Pr = 0),
    (Pe = Ee = me = null),
    (hl = !1),
    t)
  )
    throw Error(A(300));
  return e;
}
function dd() {
  var e = Ds !== 0;
  return ((Ds = 0), e);
}
function Bt() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return (Pe === null ? (me.memoizedState = Pe = e) : (Pe = Pe.next = e), Pe);
}
function bt() {
  if (Ee === null) {
    var e = me.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = Ee.next;
  var t = Pe === null ? me.memoizedState : Pe.next;
  if (t !== null) ((Pe = t), (Ee = e));
  else {
    if (e === null) throw Error(A(310));
    ((Ee = e),
      (e = {
        memoizedState: Ee.memoizedState,
        baseState: Ee.baseState,
        baseQueue: Ee.baseQueue,
        queue: Ee.queue,
        next: null,
      }),
      Pe === null ? (me.memoizedState = Pe = e) : (Pe = Pe.next = e));
  }
  return Pe;
}
function Fs(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function Da(e) {
  var t = bt(),
    n = t.queue;
  if (n === null) throw Error(A(311));
  n.lastRenderedReducer = e;
  var r = Ee,
    o = r.baseQueue,
    s = n.pending;
  if (s !== null) {
    if (o !== null) {
      var i = o.next;
      ((o.next = s.next), (s.next = i));
    }
    ((r.baseQueue = o = s), (n.pending = null));
  }
  if (o !== null) {
    ((s = o.next), (r = r.baseState));
    var a = (i = null),
      c = null,
      u = s;
    do {
      var d = u.lane;
      if ((Pr & d) === d)
        (c !== null &&
          (c = c.next =
            {
              lane: 0,
              action: u.action,
              hasEagerState: u.hasEagerState,
              eagerState: u.eagerState,
              next: null,
            }),
          (r = u.hasEagerState ? u.eagerState : e(r, u.action)));
      else {
        var p = {
          lane: d,
          action: u.action,
          hasEagerState: u.hasEagerState,
          eagerState: u.eagerState,
          next: null,
        };
        (c === null ? ((a = c = p), (i = r)) : (c = c.next = p),
          (me.lanes |= d),
          (Tr |= d));
      }
      u = u.next;
    } while (u !== null && u !== s);
    (c === null ? (i = r) : (c.next = a),
      It(r, t.memoizedState) || (et = !0),
      (t.memoizedState = r),
      (t.baseState = i),
      (t.baseQueue = c),
      (n.lastRenderedState = r));
  }
  if (((e = n.interleaved), e !== null)) {
    o = e;
    do ((s = o.lane), (me.lanes |= s), (Tr |= s), (o = o.next));
    while (o !== e);
  } else o === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function Fa(e) {
  var t = bt(),
    n = t.queue;
  if (n === null) throw Error(A(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch,
    o = n.pending,
    s = t.memoizedState;
  if (o !== null) {
    n.pending = null;
    var i = (o = o.next);
    do ((s = e(s, i.action)), (i = i.next));
    while (i !== o);
    (It(s, t.memoizedState) || (et = !0),
      (t.memoizedState = s),
      t.baseQueue === null && (t.baseState = s),
      (n.lastRenderedState = s));
  }
  return [s, r];
}
function eg() {}
function tg(e, t) {
  var n = me,
    r = bt(),
    o = t(),
    s = !It(r.memoizedState, o);
  if (
    (s && ((r.memoizedState = o), (et = !0)),
    (r = r.queue),
    fd(og.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || s || (Pe !== null && Pe.memoizedState.tag & 1))
  ) {
    if (
      ((n.flags |= 2048),
      zs(9, rg.bind(null, n, r, o, t), void 0, null),
      Ae === null)
    )
      throw Error(A(349));
    Pr & 30 || ng(n, t, o);
  }
  return o;
}
function ng(e, t, n) {
  ((e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = me.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (me.updateQueue = t),
        (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
}
function rg(e, t, n, r) {
  ((t.value = n), (t.getSnapshot = r), sg(t) && ig(e));
}
function og(e, t, n) {
  return n(function () {
    sg(t) && ig(e);
  });
}
function sg(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !It(e, n);
  } catch {
    return !0;
  }
}
function ig(e) {
  var t = gn(e, 1);
  t !== null && _t(t, e, 1, -1);
}
function ip(e) {
  var t = Bt();
  return (
    typeof e == "function" && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Fs,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = lS.bind(null, me, e)),
    [t.memoizedState, e]
  );
}
function zs(e, t, n, r) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
    (t = me.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (me.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
    e
  );
}
function lg() {
  return bt().memoizedState;
}
function $i(e, t, n, r) {
  var o = Bt();
  ((me.flags |= e),
    (o.memoizedState = zs(1 | t, n, void 0, r === void 0 ? null : r)));
}
function Hl(e, t, n, r) {
  var o = bt();
  r = r === void 0 ? null : r;
  var s = void 0;
  if (Ee !== null) {
    var i = Ee.memoizedState;
    if (((s = i.destroy), r !== null && cd(r, i.deps))) {
      o.memoizedState = zs(t, n, s, r);
      return;
    }
  }
  ((me.flags |= e), (o.memoizedState = zs(1 | t, n, s, r)));
}
function lp(e, t) {
  return $i(8390656, 8, e, t);
}
function fd(e, t) {
  return Hl(2048, 8, e, t);
}
function ag(e, t) {
  return Hl(4, 2, e, t);
}
function cg(e, t) {
  return Hl(4, 4, e, t);
}
function ug(e, t) {
  if (typeof t == "function")
    return (
      (e = e()),
      t(e),
      function () {
        t(null);
      }
    );
  if (t != null)
    return (
      (e = e()),
      (t.current = e),
      function () {
        t.current = null;
      }
    );
}
function dg(e, t, n) {
  return (
    (n = n != null ? n.concat([e]) : null),
    Hl(4, 4, ug.bind(null, t, e), n)
  );
}
function pd() {}
function fg(e, t) {
  var n = bt();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && cd(t, r[1])
    ? r[0]
    : ((n.memoizedState = [e, t]), e);
}
function pg(e, t) {
  var n = bt();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && cd(t, r[1])
    ? r[0]
    : ((e = e()), (n.memoizedState = [e, t]), e);
}
function hg(e, t, n) {
  return Pr & 21
    ? (It(n, t) || ((n = xm()), (me.lanes |= n), (Tr |= n), (e.baseState = !0)),
      t)
    : (e.baseState && ((e.baseState = !1), (et = !0)), (e.memoizedState = n));
}
function sS(e, t) {
  var n = re;
  ((re = n !== 0 && 4 > n ? n : 4), e(!0));
  var r = La.transition;
  La.transition = {};
  try {
    (e(!1), t());
  } finally {
    ((re = n), (La.transition = r));
  }
}
function mg() {
  return bt().memoizedState;
}
function iS(e, t, n) {
  var r = qn(e);
  if (
    ((n = {
      lane: r,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    gg(e))
  )
    vg(t, n);
  else if (((n = Xm(e, t, n, r)), n !== null)) {
    var o = Ge();
    (_t(n, e, r, o), yg(n, t, r));
  }
}
function lS(e, t, n) {
  var r = qn(e),
    o = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (gg(e)) vg(t, o);
  else {
    var s = e.alternate;
    if (
      e.lanes === 0 &&
      (s === null || s.lanes === 0) &&
      ((s = t.lastRenderedReducer), s !== null)
    )
      try {
        var i = t.lastRenderedState,
          a = s(i, n);
        if (((o.hasEagerState = !0), (o.eagerState = a), It(a, i))) {
          var c = t.interleaved;
          (c === null
            ? ((o.next = o), od(t))
            : ((o.next = c.next), (c.next = o)),
            (t.interleaved = o));
          return;
        }
      } catch {
      } finally {
      }
    ((n = Xm(e, t, o, r)),
      n !== null && ((o = Ge()), _t(n, e, r, o), yg(n, t, r)));
  }
}
function gg(e) {
  var t = e.alternate;
  return e === me || (t !== null && t === me);
}
function vg(e, t) {
  xs = hl = !0;
  var n = e.pending;
  (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
    (e.pending = t));
}
function yg(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    ((r &= e.pendingLanes), (n |= r), (t.lanes = n), Vu(e, n));
  }
}
var ml = {
    readContext: St,
    useCallback: De,
    useContext: De,
    useEffect: De,
    useImperativeHandle: De,
    useInsertionEffect: De,
    useLayoutEffect: De,
    useMemo: De,
    useReducer: De,
    useRef: De,
    useState: De,
    useDebugValue: De,
    useDeferredValue: De,
    useTransition: De,
    useMutableSource: De,
    useSyncExternalStore: De,
    useId: De,
    unstable_isNewReconciler: !1,
  },
  aS = {
    readContext: St,
    useCallback: function (e, t) {
      return ((Bt().memoizedState = [e, t === void 0 ? null : t]), e);
    },
    useContext: St,
    useEffect: lp,
    useImperativeHandle: function (e, t, n) {
      return (
        (n = n != null ? n.concat([e]) : null),
        $i(4194308, 4, ug.bind(null, t, e), n)
      );
    },
    useLayoutEffect: function (e, t) {
      return $i(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return $i(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var n = Bt();
      return (
        (t = t === void 0 ? null : t),
        (e = e()),
        (n.memoizedState = [e, t]),
        e
      );
    },
    useReducer: function (e, t, n) {
      var r = Bt();
      return (
        (t = n !== void 0 ? n(t) : t),
        (r.memoizedState = r.baseState = t),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: t,
        }),
        (r.queue = e),
        (e = e.dispatch = iS.bind(null, me, e)),
        [r.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = Bt();
      return ((e = { current: e }), (t.memoizedState = e));
    },
    useState: ip,
    useDebugValue: pd,
    useDeferredValue: function (e) {
      return (Bt().memoizedState = e);
    },
    useTransition: function () {
      var e = ip(!1),
        t = e[0];
      return ((e = sS.bind(null, e[1])), (Bt().memoizedState = e), [t, e]);
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = me,
        o = Bt();
      if (pe) {
        if (n === void 0) throw Error(A(407));
        n = n();
      } else {
        if (((n = t()), Ae === null)) throw Error(A(349));
        Pr & 30 || ng(r, t, n);
      }
      o.memoizedState = n;
      var s = { value: n, getSnapshot: t };
      return (
        (o.queue = s),
        lp(og.bind(null, r, s, e), [e]),
        (r.flags |= 2048),
        zs(9, rg.bind(null, r, s, n, t), void 0, null),
        n
      );
    },
    useId: function () {
      var e = Bt(),
        t = Ae.identifierPrefix;
      if (pe) {
        var n = dn,
          r = un;
        ((n = (r & ~(1 << (32 - At(r) - 1))).toString(32) + n),
          (t = ":" + t + "R" + n),
          (n = Ds++),
          0 < n && (t += "H" + n.toString(32)),
          (t += ":"));
      } else ((n = oS++), (t = ":" + t + "r" + n.toString(32) + ":"));
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  cS = {
    readContext: St,
    useCallback: fg,
    useContext: St,
    useEffect: fd,
    useImperativeHandle: dg,
    useInsertionEffect: ag,
    useLayoutEffect: cg,
    useMemo: pg,
    useReducer: Da,
    useRef: lg,
    useState: function () {
      return Da(Fs);
    },
    useDebugValue: pd,
    useDeferredValue: function (e) {
      var t = bt();
      return hg(t, Ee.memoizedState, e);
    },
    useTransition: function () {
      var e = Da(Fs)[0],
        t = bt().memoizedState;
      return [e, t];
    },
    useMutableSource: eg,
    useSyncExternalStore: tg,
    useId: mg,
    unstable_isNewReconciler: !1,
  },
  uS = {
    readContext: St,
    useCallback: fg,
    useContext: St,
    useEffect: fd,
    useImperativeHandle: dg,
    useInsertionEffect: ag,
    useLayoutEffect: cg,
    useMemo: pg,
    useReducer: Fa,
    useRef: lg,
    useState: function () {
      return Fa(Fs);
    },
    useDebugValue: pd,
    useDeferredValue: function (e) {
      var t = bt();
      return Ee === null ? (t.memoizedState = e) : hg(t, Ee.memoizedState, e);
    },
    useTransition: function () {
      var e = Fa(Fs)[0],
        t = bt().memoizedState;
      return [e, t];
    },
    useMutableSource: eg,
    useSyncExternalStore: tg,
    useId: mg,
    unstable_isNewReconciler: !1,
  };
function jt(e, t) {
  if (e && e.defaultProps) {
    ((t = ge({}, t)), (e = e.defaultProps));
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function Lc(e, t, n, r) {
  ((t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : ge({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n));
}
var Vl = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? Fr(e) === e : !1;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var r = Ge(),
      o = qn(e),
      s = fn(r, o);
    ((s.payload = t),
      n != null && (s.callback = n),
      (t = Gn(e, s, o)),
      t !== null && (_t(t, e, o, r), Fi(t, e, o)));
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var r = Ge(),
      o = qn(e),
      s = fn(r, o);
    ((s.tag = 1),
      (s.payload = t),
      n != null && (s.callback = n),
      (t = Gn(e, s, o)),
      t !== null && (_t(t, e, o, r), Fi(t, e, o)));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = Ge(),
      r = qn(e),
      o = fn(n, r);
    ((o.tag = 2),
      t != null && (o.callback = t),
      (t = Gn(e, o, r)),
      t !== null && (_t(t, e, r, n), Fi(t, e, r)));
  },
};
function ap(e, t, n, r, o, s, i) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == "function"
      ? e.shouldComponentUpdate(r, s, i)
      : t.prototype && t.prototype.isPureReactComponent
        ? !As(n, r) || !As(o, s)
        : !0
  );
}
function xg(e, t, n) {
  var r = !1,
    o = er,
    s = t.contextType;
  return (
    typeof s == "object" && s !== null
      ? (s = St(s))
      : ((o = nt(t) ? jr : Ue.current),
        (r = t.contextTypes),
        (s = (r = r != null) ? Po(e, o) : er)),
    (t = new t(n, s)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = Vl),
    (e.stateNode = t),
    (t._reactInternals = e),
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = o),
      (e.__reactInternalMemoizedMaskedChildContext = s)),
    t
  );
}
function cp(e, t, n, r) {
  ((e = t.state),
    typeof t.componentWillReceiveProps == "function" &&
      t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == "function" &&
      t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && Vl.enqueueReplaceState(t, t.state, null));
}
function Dc(e, t, n, r) {
  var o = e.stateNode;
  ((o.props = n), (o.state = e.memoizedState), (o.refs = {}), sd(e));
  var s = t.contextType;
  (typeof s == "object" && s !== null
    ? (o.context = St(s))
    : ((s = nt(t) ? jr : Ue.current), (o.context = Po(e, s))),
    (o.state = e.memoizedState),
    (s = t.getDerivedStateFromProps),
    typeof s == "function" && (Lc(e, t, s, n), (o.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == "function" ||
      typeof o.getSnapshotBeforeUpdate == "function" ||
      (typeof o.UNSAFE_componentWillMount != "function" &&
        typeof o.componentWillMount != "function") ||
      ((t = o.state),
      typeof o.componentWillMount == "function" && o.componentWillMount(),
      typeof o.UNSAFE_componentWillMount == "function" &&
        o.UNSAFE_componentWillMount(),
      t !== o.state && Vl.enqueueReplaceState(o, o.state, null),
      fl(e, n, o, r),
      (o.state = e.memoizedState)),
    typeof o.componentDidMount == "function" && (e.flags |= 4194308));
}
function _o(e, t) {
  try {
    var n = "",
      r = t;
    do ((n += Fw(r)), (r = r.return));
    while (r);
    var o = n;
  } catch (s) {
    o =
      `
Error generating stack: ` +
      s.message +
      `
` +
      s.stack;
  }
  return { value: e, source: t, stack: o, digest: null };
}
function za(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function Fc(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var dS = typeof WeakMap == "function" ? WeakMap : Map;
function wg(e, t, n) {
  ((n = fn(-1, n)), (n.tag = 3), (n.payload = { element: null }));
  var r = t.value;
  return (
    (n.callback = function () {
      (vl || ((vl = !0), (Gc = r)), Fc(e, t));
    }),
    n
  );
}
function Sg(e, t, n) {
  ((n = fn(-1, n)), (n.tag = 3));
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var o = t.value;
    ((n.payload = function () {
      return r(o);
    }),
      (n.callback = function () {
        Fc(e, t);
      }));
  }
  var s = e.stateNode;
  return (
    s !== null &&
      typeof s.componentDidCatch == "function" &&
      (n.callback = function () {
        (Fc(e, t),
          typeof r != "function" &&
            (Yn === null ? (Yn = new Set([this])) : Yn.add(this)));
        var i = t.stack;
        this.componentDidCatch(t.value, {
          componentStack: i !== null ? i : "",
        });
      }),
    n
  );
}
function up(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new dS();
    var o = new Set();
    r.set(t, o);
  } else ((o = r.get(t)), o === void 0 && ((o = new Set()), r.set(t, o)));
  o.has(n) || (o.add(n), (e = ES.bind(null, e, t, n)), t.then(e, e));
}
function dp(e) {
  do {
    var t;
    if (
      ((t = e.tag === 13) &&
        ((t = e.memoizedState), (t = t !== null ? t.dehydrated !== null : !0)),
      t)
    )
      return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function fp(e, t, n, r, o) {
  return e.mode & 1
    ? ((e.flags |= 65536), (e.lanes = o), e)
    : (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null
              ? (n.tag = 17)
              : ((t = fn(-1, 1)), (t.tag = 2), Gn(n, t, 1))),
          (n.lanes |= 1)),
      e);
}
var fS = Sn.ReactCurrentOwner,
  et = !1;
function Ke(e, t, n, r) {
  t.child = e === null ? qm(t, null, n, r) : Ro(t, e.child, n, r);
}
function pp(e, t, n, r, o) {
  n = n.render;
  var s = t.ref;
  return (
    io(t, o),
    (r = ud(e, t, n, r, s, o)),
    (n = dd()),
    e !== null && !et
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~o),
        vn(e, t, o))
      : (pe && n && Zu(t), (t.flags |= 1), Ke(e, t, r, o), t.child)
  );
}
function hp(e, t, n, r, o) {
  if (e === null) {
    var s = n.type;
    return typeof s == "function" &&
      !Sd(s) &&
      s.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = s), bg(e, t, s, r, o))
      : ((e = Vi(n.type, null, r, t, t.mode, o)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e));
  }
  if (((s = e.child), !(e.lanes & o))) {
    var i = s.memoizedProps;
    if (
      ((n = n.compare), (n = n !== null ? n : As), n(i, r) && e.ref === t.ref)
    )
      return vn(e, t, o);
  }
  return (
    (t.flags |= 1),
    (e = Xn(s, r)),
    (e.ref = t.ref),
    (e.return = t),
    (t.child = e)
  );
}
function bg(e, t, n, r, o) {
  if (e !== null) {
    var s = e.memoizedProps;
    if (As(s, r) && e.ref === t.ref)
      if (((et = !1), (t.pendingProps = r = s), (e.lanes & o) !== 0))
        e.flags & 131072 && (et = !0);
      else return ((t.lanes = e.lanes), vn(e, t, o));
  }
  return zc(e, t, n, r, o);
}
function Cg(e, t, n) {
  var r = t.pendingProps,
    o = r.children,
    s = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden")
    if (!(t.mode & 1))
      ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        ae(to, it),
        (it |= n));
    else {
      if (!(n & 1073741824))
        return (
          (e = s !== null ? s.baseLanes | n : n),
          (t.lanes = t.childLanes = 1073741824),
          (t.memoizedState = {
            baseLanes: e,
            cachePool: null,
            transitions: null,
          }),
          (t.updateQueue = null),
          ae(to, it),
          (it |= e),
          null
        );
      ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = s !== null ? s.baseLanes : n),
        ae(to, it),
        (it |= r));
    }
  else
    (s !== null ? ((r = s.baseLanes | n), (t.memoizedState = null)) : (r = n),
      ae(to, it),
      (it |= r));
  return (Ke(e, t, o, n), t.child);
}
function Ng(e, t) {
  var n = t.ref;
  ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function zc(e, t, n, r, o) {
  var s = nt(n) ? jr : Ue.current;
  return (
    (s = Po(t, s)),
    io(t, o),
    (n = ud(e, t, n, r, s, o)),
    (r = dd()),
    e !== null && !et
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~o),
        vn(e, t, o))
      : (pe && r && Zu(t), (t.flags |= 1), Ke(e, t, n, o), t.child)
  );
}
function mp(e, t, n, r, o) {
  if (nt(n)) {
    var s = !0;
    ll(t);
  } else s = !1;
  if ((io(t, o), t.stateNode === null))
    (Ui(e, t), xg(t, n, r), Dc(t, n, r, o), (r = !0));
  else if (e === null) {
    var i = t.stateNode,
      a = t.memoizedProps;
    i.props = a;
    var c = i.context,
      u = n.contextType;
    typeof u == "object" && u !== null
      ? (u = St(u))
      : ((u = nt(n) ? jr : Ue.current), (u = Po(t, u)));
    var d = n.getDerivedStateFromProps,
      p =
        typeof d == "function" ||
        typeof i.getSnapshotBeforeUpdate == "function";
    (p ||
      (typeof i.UNSAFE_componentWillReceiveProps != "function" &&
        typeof i.componentWillReceiveProps != "function") ||
      ((a !== r || c !== u) && cp(t, i, r, u)),
      (Rn = !1));
    var h = t.memoizedState;
    ((i.state = h),
      fl(t, r, i, o),
      (c = t.memoizedState),
      a !== r || h !== c || tt.current || Rn
        ? (typeof d == "function" && (Lc(t, n, d, r), (c = t.memoizedState)),
          (a = Rn || ap(t, n, a, r, h, c, u))
            ? (p ||
                (typeof i.UNSAFE_componentWillMount != "function" &&
                  typeof i.componentWillMount != "function") ||
                (typeof i.componentWillMount == "function" &&
                  i.componentWillMount(),
                typeof i.UNSAFE_componentWillMount == "function" &&
                  i.UNSAFE_componentWillMount()),
              typeof i.componentDidMount == "function" && (t.flags |= 4194308))
            : (typeof i.componentDidMount == "function" && (t.flags |= 4194308),
              (t.memoizedProps = r),
              (t.memoizedState = c)),
          (i.props = r),
          (i.state = c),
          (i.context = u),
          (r = a))
        : (typeof i.componentDidMount == "function" && (t.flags |= 4194308),
          (r = !1)));
  } else {
    ((i = t.stateNode),
      Zm(e, t),
      (a = t.memoizedProps),
      (u = t.type === t.elementType ? a : jt(t.type, a)),
      (i.props = u),
      (p = t.pendingProps),
      (h = i.context),
      (c = n.contextType),
      typeof c == "object" && c !== null
        ? (c = St(c))
        : ((c = nt(n) ? jr : Ue.current), (c = Po(t, c))));
    var x = n.getDerivedStateFromProps;
    ((d =
      typeof x == "function" ||
      typeof i.getSnapshotBeforeUpdate == "function") ||
      (typeof i.UNSAFE_componentWillReceiveProps != "function" &&
        typeof i.componentWillReceiveProps != "function") ||
      ((a !== p || h !== c) && cp(t, i, r, c)),
      (Rn = !1),
      (h = t.memoizedState),
      (i.state = h),
      fl(t, r, i, o));
    var S = t.memoizedState;
    a !== p || h !== S || tt.current || Rn
      ? (typeof x == "function" && (Lc(t, n, x, r), (S = t.memoizedState)),
        (u = Rn || ap(t, n, u, r, h, S, c) || !1)
          ? (d ||
              (typeof i.UNSAFE_componentWillUpdate != "function" &&
                typeof i.componentWillUpdate != "function") ||
              (typeof i.componentWillUpdate == "function" &&
                i.componentWillUpdate(r, S, c),
              typeof i.UNSAFE_componentWillUpdate == "function" &&
                i.UNSAFE_componentWillUpdate(r, S, c)),
            typeof i.componentDidUpdate == "function" && (t.flags |= 4),
            typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
          : (typeof i.componentDidUpdate != "function" ||
              (a === e.memoizedProps && h === e.memoizedState) ||
              (t.flags |= 4),
            typeof i.getSnapshotBeforeUpdate != "function" ||
              (a === e.memoizedProps && h === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = r),
            (t.memoizedState = S)),
        (i.props = r),
        (i.state = S),
        (i.context = c),
        (r = u))
      : (typeof i.componentDidUpdate != "function" ||
          (a === e.memoizedProps && h === e.memoizedState) ||
          (t.flags |= 4),
        typeof i.getSnapshotBeforeUpdate != "function" ||
          (a === e.memoizedProps && h === e.memoizedState) ||
          (t.flags |= 1024),
        (r = !1));
  }
  return $c(e, t, n, r, s, o);
}
function $c(e, t, n, r, o, s) {
  Ng(e, t);
  var i = (t.flags & 128) !== 0;
  if (!r && !i) return (o && ep(t, n, !1), vn(e, t, s));
  ((r = t.stateNode), (fS.current = t));
  var a =
    i && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return (
    (t.flags |= 1),
    e !== null && i
      ? ((t.child = Ro(t, e.child, null, s)), (t.child = Ro(t, null, a, s)))
      : Ke(e, t, a, s),
    (t.memoizedState = r.state),
    o && ep(t, n, !0),
    t.child
  );
}
function Eg(e) {
  var t = e.stateNode;
  (t.pendingContext
    ? Jf(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && Jf(e, t.context, !1),
    id(e, t.containerInfo));
}
function gp(e, t, n, r, o) {
  return (To(), ed(o), (t.flags |= 256), Ke(e, t, n, r), t.child);
}
var Uc = { dehydrated: null, treeContext: null, retryLane: 0 };
function Bc(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function jg(e, t, n) {
  var r = t.pendingProps,
    o = he.current,
    s = !1,
    i = (t.flags & 128) !== 0,
    a;
  if (
    ((a = i) ||
      (a = e !== null && e.memoizedState === null ? !1 : (o & 2) !== 0),
    a
      ? ((s = !0), (t.flags &= -129))
      : (e === null || e.memoizedState !== null) && (o |= 1),
    ae(he, o & 1),
    e === null)
  )
    return (
      Ic(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? (t.mode & 1
            ? e.data === "$!"
              ? (t.lanes = 8)
              : (t.lanes = 1073741824)
            : (t.lanes = 1),
          null)
        : ((i = r.children),
          (e = r.fallback),
          s
            ? ((r = t.mode),
              (s = t.child),
              (i = { mode: "hidden", children: i }),
              !(r & 1) && s !== null
                ? ((s.childLanes = 0), (s.pendingProps = i))
                : (s = Ql(i, r, 0, null)),
              (e = Er(e, r, n, null)),
              (s.return = t),
              (e.return = t),
              (s.sibling = e),
              (t.child = s),
              (t.child.memoizedState = Bc(n)),
              (t.memoizedState = Uc),
              e)
            : hd(t, i))
    );
  if (((o = e.memoizedState), o !== null && ((a = o.dehydrated), a !== null)))
    return pS(e, t, i, r, a, o, n);
  if (s) {
    ((s = r.fallback), (i = t.mode), (o = e.child), (a = o.sibling));
    var c = { mode: "hidden", children: r.children };
    return (
      !(i & 1) && t.child !== o
        ? ((r = t.child),
          (r.childLanes = 0),
          (r.pendingProps = c),
          (t.deletions = null))
        : ((r = Xn(o, c)), (r.subtreeFlags = o.subtreeFlags & 14680064)),
      a !== null ? (s = Xn(a, s)) : ((s = Er(s, i, n, null)), (s.flags |= 2)),
      (s.return = t),
      (r.return = t),
      (r.sibling = s),
      (t.child = r),
      (r = s),
      (s = t.child),
      (i = e.child.memoizedState),
      (i =
        i === null
          ? Bc(n)
          : {
              baseLanes: i.baseLanes | n,
              cachePool: null,
              transitions: i.transitions,
            }),
      (s.memoizedState = i),
      (s.childLanes = e.childLanes & ~n),
      (t.memoizedState = Uc),
      r
    );
  }
  return (
    (s = e.child),
    (e = s.sibling),
    (r = Xn(s, { mode: "visible", children: r.children })),
    !(t.mode & 1) && (r.lanes = n),
    (r.return = t),
    (r.sibling = null),
    e !== null &&
      ((n = t.deletions),
      n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
    (t.child = r),
    (t.memoizedState = null),
    r
  );
}
function hd(e, t) {
  return (
    (t = Ql({ mode: "visible", children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  );
}
function wi(e, t, n, r) {
  return (
    r !== null && ed(r),
    Ro(t, e.child, null, n),
    (e = hd(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function pS(e, t, n, r, o, s, i) {
  if (n)
    return t.flags & 256
      ? ((t.flags &= -257), (r = za(Error(A(422)))), wi(e, t, i, r))
      : t.memoizedState !== null
        ? ((t.child = e.child), (t.flags |= 128), null)
        : ((s = r.fallback),
          (o = t.mode),
          (r = Ql({ mode: "visible", children: r.children }, o, 0, null)),
          (s = Er(s, o, i, null)),
          (s.flags |= 2),
          (r.return = t),
          (s.return = t),
          (r.sibling = s),
          (t.child = r),
          t.mode & 1 && Ro(t, e.child, null, i),
          (t.child.memoizedState = Bc(i)),
          (t.memoizedState = Uc),
          s);
  if (!(t.mode & 1)) return wi(e, t, i, null);
  if (o.data === "$!") {
    if (((r = o.nextSibling && o.nextSibling.dataset), r)) var a = r.dgst;
    return (
      (r = a),
      (s = Error(A(419))),
      (r = za(s, r, void 0)),
      wi(e, t, i, r)
    );
  }
  if (((a = (i & e.childLanes) !== 0), et || a)) {
    if (((r = Ae), r !== null)) {
      switch (i & -i) {
        case 4:
          o = 2;
          break;
        case 16:
          o = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          o = 32;
          break;
        case 536870912:
          o = 268435456;
          break;
        default:
          o = 0;
      }
      ((o = o & (r.suspendedLanes | i) ? 0 : o),
        o !== 0 &&
          o !== s.retryLane &&
          ((s.retryLane = o), gn(e, o), _t(r, e, o, -1)));
    }
    return (wd(), (r = za(Error(A(421)))), wi(e, t, i, r));
  }
  return o.data === "$?"
    ? ((t.flags |= 128),
      (t.child = e.child),
      (t = jS.bind(null, e)),
      (o._reactRetry = t),
      null)
    : ((e = s.treeContext),
      (at = Qn(o.nextSibling)),
      (ct = t),
      (pe = !0),
      (Tt = null),
      e !== null &&
        ((gt[vt++] = un),
        (gt[vt++] = dn),
        (gt[vt++] = kr),
        (un = e.id),
        (dn = e.overflow),
        (kr = t)),
      (t = hd(t, r.children)),
      (t.flags |= 4096),
      t);
}
function vp(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  (r !== null && (r.lanes |= t), Mc(e.return, t, n));
}
function $a(e, t, n, r, o) {
  var s = e.memoizedState;
  s === null
    ? (e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: r,
        tail: n,
        tailMode: o,
      })
    : ((s.isBackwards = t),
      (s.rendering = null),
      (s.renderingStartTime = 0),
      (s.last = r),
      (s.tail = n),
      (s.tailMode = o));
}
function kg(e, t, n) {
  var r = t.pendingProps,
    o = r.revealOrder,
    s = r.tail;
  if ((Ke(e, t, r.children, n), (r = he.current), r & 2))
    ((r = (r & 1) | 2), (t.flags |= 128));
  else {
    if (e !== null && e.flags & 128)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && vp(e, n, t);
        else if (e.tag === 19) vp(e, n, t);
        else if (e.child !== null) {
          ((e.child.return = e), (e = e.child));
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    r &= 1;
  }
  if ((ae(he, r), !(t.mode & 1))) t.memoizedState = null;
  else
    switch (o) {
      case "forwards":
        for (n = t.child, o = null; n !== null; )
          ((e = n.alternate),
            e !== null && pl(e) === null && (o = n),
            (n = n.sibling));
        ((n = o),
          n === null
            ? ((o = t.child), (t.child = null))
            : ((o = n.sibling), (n.sibling = null)),
          $a(t, !1, o, n, s));
        break;
      case "backwards":
        for (n = null, o = t.child, t.child = null; o !== null; ) {
          if (((e = o.alternate), e !== null && pl(e) === null)) {
            t.child = o;
            break;
          }
          ((e = o.sibling), (o.sibling = n), (n = o), (o = e));
        }
        $a(t, !0, n, null, s);
        break;
      case "together":
        $a(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function Ui(e, t) {
  !(t.mode & 1) &&
    e !== null &&
    ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function vn(e, t, n) {
  if (
    (e !== null && (t.dependencies = e.dependencies),
    (Tr |= t.lanes),
    !(n & t.childLanes))
  )
    return null;
  if (e !== null && t.child !== e.child) throw Error(A(153));
  if (t.child !== null) {
    for (
      e = t.child, n = Xn(e, e.pendingProps), t.child = n, n.return = t;
      e.sibling !== null;
    )
      ((e = e.sibling),
        (n = n.sibling = Xn(e, e.pendingProps)),
        (n.return = t));
    n.sibling = null;
  }
  return t.child;
}
function hS(e, t, n) {
  switch (t.tag) {
    case 3:
      (Eg(t), To());
      break;
    case 5:
      Jm(t);
      break;
    case 1:
      nt(t.type) && ll(t);
      break;
    case 4:
      id(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context,
        o = t.memoizedProps.value;
      (ae(ul, r._currentValue), (r._currentValue = o));
      break;
    case 13:
      if (((r = t.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (ae(he, he.current & 1), (t.flags |= 128), null)
          : n & t.child.childLanes
            ? jg(e, t, n)
            : (ae(he, he.current & 1),
              (e = vn(e, t, n)),
              e !== null ? e.sibling : null);
      ae(he, he.current & 1);
      break;
    case 19:
      if (((r = (n & t.childLanes) !== 0), e.flags & 128)) {
        if (r) return kg(e, t, n);
        t.flags |= 128;
      }
      if (
        ((o = t.memoizedState),
        o !== null &&
          ((o.rendering = null), (o.tail = null), (o.lastEffect = null)),
        ae(he, he.current),
        r)
      )
        break;
      return null;
    case 22:
    case 23:
      return ((t.lanes = 0), Cg(e, t, n));
  }
  return vn(e, t, n);
}
var Pg, Hc, Tg, Rg;
Pg = function (e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      ((n.child.return = n), (n = n.child));
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    ((n.sibling.return = n.return), (n = n.sibling));
  }
};
Hc = function () {};
Tg = function (e, t, n, r) {
  var o = e.memoizedProps;
  if (o !== r) {
    ((e = t.stateNode), hr(qt.current));
    var s = null;
    switch (n) {
      case "input":
        ((o = dc(e, o)), (r = dc(e, r)), (s = []));
        break;
      case "select":
        ((o = ge({}, o, { value: void 0 })),
          (r = ge({}, r, { value: void 0 })),
          (s = []));
        break;
      case "textarea":
        ((o = hc(e, o)), (r = hc(e, r)), (s = []));
        break;
      default:
        typeof o.onClick != "function" &&
          typeof r.onClick == "function" &&
          (e.onclick = sl);
    }
    gc(n, r);
    var i;
    n = null;
    for (u in o)
      if (!r.hasOwnProperty(u) && o.hasOwnProperty(u) && o[u] != null)
        if (u === "style") {
          var a = o[u];
          for (i in a) a.hasOwnProperty(i) && (n || (n = {}), (n[i] = ""));
        } else
          u !== "dangerouslySetInnerHTML" &&
            u !== "children" &&
            u !== "suppressContentEditableWarning" &&
            u !== "suppressHydrationWarning" &&
            u !== "autoFocus" &&
            (Ns.hasOwnProperty(u)
              ? s || (s = [])
              : (s = s || []).push(u, null));
    for (u in r) {
      var c = r[u];
      if (
        ((a = o != null ? o[u] : void 0),
        r.hasOwnProperty(u) && c !== a && (c != null || a != null))
      )
        if (u === "style")
          if (a) {
            for (i in a)
              !a.hasOwnProperty(i) ||
                (c && c.hasOwnProperty(i)) ||
                (n || (n = {}), (n[i] = ""));
            for (i in c)
              c.hasOwnProperty(i) &&
                a[i] !== c[i] &&
                (n || (n = {}), (n[i] = c[i]));
          } else (n || (s || (s = []), s.push(u, n)), (n = c));
        else
          u === "dangerouslySetInnerHTML"
            ? ((c = c ? c.__html : void 0),
              (a = a ? a.__html : void 0),
              c != null && a !== c && (s = s || []).push(u, c))
            : u === "children"
              ? (typeof c != "string" && typeof c != "number") ||
                (s = s || []).push(u, "" + c)
              : u !== "suppressContentEditableWarning" &&
                u !== "suppressHydrationWarning" &&
                (Ns.hasOwnProperty(u)
                  ? (c != null && u === "onScroll" && de("scroll", e),
                    s || a === c || (s = []))
                  : (s = s || []).push(u, c));
    }
    n && (s = s || []).push("style", n);
    var u = s;
    (t.updateQueue = u) && (t.flags |= 4);
  }
};
Rg = function (e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function os(e, t) {
  if (!pe)
    switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var n = null; t !== null; )
          (t.alternate !== null && (n = t), (t = t.sibling));
        n === null ? (e.tail = null) : (n.sibling = null);
        break;
      case "collapsed":
        n = e.tail;
        for (var r = null; n !== null; )
          (n.alternate !== null && (r = n), (n = n.sibling));
        r === null
          ? t || e.tail === null
            ? (e.tail = null)
            : (e.tail.sibling = null)
          : (r.sibling = null);
    }
}
function Fe(e) {
  var t = e.alternate !== null && e.alternate.child === e.child,
    n = 0,
    r = 0;
  if (t)
    for (var o = e.child; o !== null; )
      ((n |= o.lanes | o.childLanes),
        (r |= o.subtreeFlags & 14680064),
        (r |= o.flags & 14680064),
        (o.return = e),
        (o = o.sibling));
  else
    for (o = e.child; o !== null; )
      ((n |= o.lanes | o.childLanes),
        (r |= o.subtreeFlags),
        (r |= o.flags),
        (o.return = e),
        (o = o.sibling));
  return ((e.subtreeFlags |= r), (e.childLanes = n), t);
}
function mS(e, t, n) {
  var r = t.pendingProps;
  switch ((Ju(t), t.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return (Fe(t), null);
    case 1:
      return (nt(t.type) && il(), Fe(t), null);
    case 3:
      return (
        (r = t.stateNode),
        Ao(),
        fe(tt),
        fe(Ue),
        ad(),
        r.pendingContext &&
          ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e === null || e.child === null) &&
          (yi(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
              ((t.flags |= 1024), Tt !== null && (Xc(Tt), (Tt = null)))),
        Hc(e, t),
        Fe(t),
        null
      );
    case 5:
      ld(t);
      var o = hr(Ls.current);
      if (((n = t.type), e !== null && t.stateNode != null))
        (Tg(e, t, n, r, o),
          e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152)));
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(A(166));
          return (Fe(t), null);
        }
        if (((e = hr(qt.current)), yi(t))) {
          ((r = t.stateNode), (n = t.type));
          var s = t.memoizedProps;
          switch (((r[Qt] = t), (r[Is] = s), (e = (t.mode & 1) !== 0), n)) {
            case "dialog":
              (de("cancel", r), de("close", r));
              break;
            case "iframe":
            case "object":
            case "embed":
              de("load", r);
              break;
            case "video":
            case "audio":
              for (o = 0; o < ds.length; o++) de(ds[o], r);
              break;
            case "source":
              de("error", r);
              break;
            case "img":
            case "image":
            case "link":
              (de("error", r), de("load", r));
              break;
            case "details":
              de("toggle", r);
              break;
            case "input":
              (jf(r, s), de("invalid", r));
              break;
            case "select":
              ((r._wrapperState = { wasMultiple: !!s.multiple }),
                de("invalid", r));
              break;
            case "textarea":
              (Pf(r, s), de("invalid", r));
          }
          (gc(n, s), (o = null));
          for (var i in s)
            if (s.hasOwnProperty(i)) {
              var a = s[i];
              i === "children"
                ? typeof a == "string"
                  ? r.textContent !== a &&
                    (s.suppressHydrationWarning !== !0 &&
                      vi(r.textContent, a, e),
                    (o = ["children", a]))
                  : typeof a == "number" &&
                    r.textContent !== "" + a &&
                    (s.suppressHydrationWarning !== !0 &&
                      vi(r.textContent, a, e),
                    (o = ["children", "" + a]))
                : Ns.hasOwnProperty(i) &&
                  a != null &&
                  i === "onScroll" &&
                  de("scroll", r);
            }
          switch (n) {
            case "input":
              (ci(r), kf(r, s, !0));
              break;
            case "textarea":
              (ci(r), Tf(r));
              break;
            case "select":
            case "option":
              break;
            default:
              typeof s.onClick == "function" && (r.onclick = sl);
          }
          ((r = o), (t.updateQueue = r), r !== null && (t.flags |= 4));
        } else {
          ((i = o.nodeType === 9 ? o : o.ownerDocument),
            e === "http://www.w3.org/1999/xhtml" && (e = om(n)),
            e === "http://www.w3.org/1999/xhtml"
              ? n === "script"
                ? ((e = i.createElement("div")),
                  (e.innerHTML = "<script><\/script>"),
                  (e = e.removeChild(e.firstChild)))
                : typeof r.is == "string"
                  ? (e = i.createElement(n, { is: r.is }))
                  : ((e = i.createElement(n)),
                    n === "select" &&
                      ((i = e),
                      r.multiple
                        ? (i.multiple = !0)
                        : r.size && (i.size = r.size)))
              : (e = i.createElementNS(e, n)),
            (e[Qt] = t),
            (e[Is] = r),
            Pg(e, t, !1, !1),
            (t.stateNode = e));
          e: {
            switch (((i = vc(n, r)), n)) {
              case "dialog":
                (de("cancel", e), de("close", e), (o = r));
                break;
              case "iframe":
              case "object":
              case "embed":
                (de("load", e), (o = r));
                break;
              case "video":
              case "audio":
                for (o = 0; o < ds.length; o++) de(ds[o], e);
                o = r;
                break;
              case "source":
                (de("error", e), (o = r));
                break;
              case "img":
              case "image":
              case "link":
                (de("error", e), de("load", e), (o = r));
                break;
              case "details":
                (de("toggle", e), (o = r));
                break;
              case "input":
                (jf(e, r), (o = dc(e, r)), de("invalid", e));
                break;
              case "option":
                o = r;
                break;
              case "select":
                ((e._wrapperState = { wasMultiple: !!r.multiple }),
                  (o = ge({}, r, { value: void 0 })),
                  de("invalid", e));
                break;
              case "textarea":
                (Pf(e, r), (o = hc(e, r)), de("invalid", e));
                break;
              default:
                o = r;
            }
            (gc(n, o), (a = o));
            for (s in a)
              if (a.hasOwnProperty(s)) {
                var c = a[s];
                s === "style"
                  ? lm(e, c)
                  : s === "dangerouslySetInnerHTML"
                    ? ((c = c ? c.__html : void 0), c != null && sm(e, c))
                    : s === "children"
                      ? typeof c == "string"
                        ? (n !== "textarea" || c !== "") && Es(e, c)
                        : typeof c == "number" && Es(e, "" + c)
                      : s !== "suppressContentEditableWarning" &&
                        s !== "suppressHydrationWarning" &&
                        s !== "autoFocus" &&
                        (Ns.hasOwnProperty(s)
                          ? c != null && s === "onScroll" && de("scroll", e)
                          : c != null && Fu(e, s, c, i));
              }
            switch (n) {
              case "input":
                (ci(e), kf(e, r, !1));
                break;
              case "textarea":
                (ci(e), Tf(e));
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + Jn(r.value));
                break;
              case "select":
                ((e.multiple = !!r.multiple),
                  (s = r.value),
                  s != null
                    ? no(e, !!r.multiple, s, !1)
                    : r.defaultValue != null &&
                      no(e, !!r.multiple, r.defaultValue, !0));
                break;
              default:
                typeof o.onClick == "function" && (e.onclick = sl);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (t.flags |= 4);
        }
        t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
      }
      return (Fe(t), null);
    case 6:
      if (e && t.stateNode != null) Rg(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(A(166));
        if (((n = hr(Ls.current)), hr(qt.current), yi(t))) {
          if (
            ((r = t.stateNode),
            (n = t.memoizedProps),
            (r[Qt] = t),
            (s = r.nodeValue !== n) && ((e = ct), e !== null))
          )
            switch (e.tag) {
              case 3:
                vi(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  vi(r.nodeValue, n, (e.mode & 1) !== 0);
            }
          s && (t.flags |= 4);
        } else
          ((r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[Qt] = t),
            (t.stateNode = r));
      }
      return (Fe(t), null);
    case 13:
      if (
        (fe(he),
        (r = t.memoizedState),
        e === null ||
          (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (pe && at !== null && t.mode & 1 && !(t.flags & 128))
          (Gm(), To(), (t.flags |= 98560), (s = !1));
        else if (((s = yi(t)), r !== null && r.dehydrated !== null)) {
          if (e === null) {
            if (!s) throw Error(A(318));
            if (
              ((s = t.memoizedState),
              (s = s !== null ? s.dehydrated : null),
              !s)
            )
              throw Error(A(317));
            s[Qt] = t;
          } else
            (To(),
              !(t.flags & 128) && (t.memoizedState = null),
              (t.flags |= 4));
          (Fe(t), (s = !1));
        } else (Tt !== null && (Xc(Tt), (Tt = null)), (s = !0));
        if (!s) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128
        ? ((t.lanes = n), t)
        : ((r = r !== null),
          r !== (e !== null && e.memoizedState !== null) &&
            r &&
            ((t.child.flags |= 8192),
            t.mode & 1 &&
              (e === null || he.current & 1 ? ke === 0 && (ke = 3) : wd())),
          t.updateQueue !== null && (t.flags |= 4),
          Fe(t),
          null);
    case 4:
      return (
        Ao(),
        Hc(e, t),
        e === null && _s(t.stateNode.containerInfo),
        Fe(t),
        null
      );
    case 10:
      return (rd(t.type._context), Fe(t), null);
    case 17:
      return (nt(t.type) && il(), Fe(t), null);
    case 19:
      if ((fe(he), (s = t.memoizedState), s === null)) return (Fe(t), null);
      if (((r = (t.flags & 128) !== 0), (i = s.rendering), i === null))
        if (r) os(s, !1);
        else {
          if (ke !== 0 || (e !== null && e.flags & 128))
            for (e = t.child; e !== null; ) {
              if (((i = pl(e)), i !== null)) {
                for (
                  t.flags |= 128,
                    os(s, !1),
                    r = i.updateQueue,
                    r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    r = n,
                    n = t.child;
                  n !== null;
                )
                  ((s = n),
                    (e = r),
                    (s.flags &= 14680066),
                    (i = s.alternate),
                    i === null
                      ? ((s.childLanes = 0),
                        (s.lanes = e),
                        (s.child = null),
                        (s.subtreeFlags = 0),
                        (s.memoizedProps = null),
                        (s.memoizedState = null),
                        (s.updateQueue = null),
                        (s.dependencies = null),
                        (s.stateNode = null))
                      : ((s.childLanes = i.childLanes),
                        (s.lanes = i.lanes),
                        (s.child = i.child),
                        (s.subtreeFlags = 0),
                        (s.deletions = null),
                        (s.memoizedProps = i.memoizedProps),
                        (s.memoizedState = i.memoizedState),
                        (s.updateQueue = i.updateQueue),
                        (s.type = i.type),
                        (e = i.dependencies),
                        (s.dependencies =
                          e === null
                            ? null
                            : {
                                lanes: e.lanes,
                                firstContext: e.firstContext,
                              })),
                    (n = n.sibling));
                return (ae(he, (he.current & 1) | 2), t.child);
              }
              e = e.sibling;
            }
          s.tail !== null &&
            Se() > Oo &&
            ((t.flags |= 128), (r = !0), os(s, !1), (t.lanes = 4194304));
        }
      else {
        if (!r)
          if (((e = pl(i)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              os(s, !0),
              s.tail === null && s.tailMode === "hidden" && !i.alternate && !pe)
            )
              return (Fe(t), null);
          } else
            2 * Se() - s.renderingStartTime > Oo &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), os(s, !1), (t.lanes = 4194304));
        s.isBackwards
          ? ((i.sibling = t.child), (t.child = i))
          : ((n = s.last),
            n !== null ? (n.sibling = i) : (t.child = i),
            (s.last = i));
      }
      return s.tail !== null
        ? ((t = s.tail),
          (s.rendering = t),
          (s.tail = t.sibling),
          (s.renderingStartTime = Se()),
          (t.sibling = null),
          (n = he.current),
          ae(he, r ? (n & 1) | 2 : n & 1),
          t)
        : (Fe(t), null);
    case 22:
    case 23:
      return (
        xd(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && t.mode & 1
          ? it & 1073741824 && (Fe(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : Fe(t),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(A(156, t.tag));
}
function gS(e, t) {
  switch ((Ju(t), t.tag)) {
    case 1:
      return (
        nt(t.type) && il(),
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 3:
      return (
        Ao(),
        fe(tt),
        fe(Ue),
        ad(),
        (e = t.flags),
        e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 5:
      return (ld(t), null);
    case 13:
      if (
        (fe(he), (e = t.memoizedState), e !== null && e.dehydrated !== null)
      ) {
        if (t.alternate === null) throw Error(A(340));
        To();
      }
      return (
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 19:
      return (fe(he), null);
    case 4:
      return (Ao(), null);
    case 10:
      return (rd(t.type._context), null);
    case 22:
    case 23:
      return (xd(), null);
    case 24:
      return null;
    default:
      return null;
  }
}
var Si = !1,
  $e = !1,
  vS = typeof WeakSet == "function" ? WeakSet : Set,
  D = null;
function eo(e, t) {
  var n = e.ref;
  if (n !== null)
    if (typeof n == "function")
      try {
        n(null);
      } catch (r) {
        ye(e, t, r);
      }
    else n.current = null;
}
function Vc(e, t, n) {
  try {
    n();
  } catch (r) {
    ye(e, t, r);
  }
}
var yp = !1;
function yS(e, t) {
  if (((kc = nl), (e = Mm()), Xu(e))) {
    if ("selectionStart" in e)
      var n = { start: e.selectionStart, end: e.selectionEnd };
    else
      e: {
        n = ((n = e.ownerDocument) && n.defaultView) || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var o = r.anchorOffset,
            s = r.focusNode;
          r = r.focusOffset;
          try {
            (n.nodeType, s.nodeType);
          } catch {
            n = null;
            break e;
          }
          var i = 0,
            a = -1,
            c = -1,
            u = 0,
            d = 0,
            p = e,
            h = null;
          t: for (;;) {
            for (
              var x;
              p !== n || (o !== 0 && p.nodeType !== 3) || (a = i + o),
                p !== s || (r !== 0 && p.nodeType !== 3) || (c = i + r),
                p.nodeType === 3 && (i += p.nodeValue.length),
                (x = p.firstChild) !== null;
            )
              ((h = p), (p = x));
            for (;;) {
              if (p === e) break t;
              if (
                (h === n && ++u === o && (a = i),
                h === s && ++d === r && (c = i),
                (x = p.nextSibling) !== null)
              )
                break;
              ((p = h), (h = p.parentNode));
            }
            p = x;
          }
          n = a === -1 || c === -1 ? null : { start: a, end: c };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (Pc = { focusedElem: e, selectionRange: n }, nl = !1, D = t; D !== null; )
    if (((t = D), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      ((e.return = t), (D = e));
    else
      for (; D !== null; ) {
        t = D;
        try {
          var S = t.alternate;
          if (t.flags & 1024)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (S !== null) {
                  var v = S.memoizedProps,
                    w = S.memoizedState,
                    g = t.stateNode,
                    m = g.getSnapshotBeforeUpdate(
                      t.elementType === t.type ? v : jt(t.type, v),
                      w,
                    );
                  g.__reactInternalSnapshotBeforeUpdate = m;
                }
                break;
              case 3:
                var y = t.stateNode.containerInfo;
                y.nodeType === 1
                  ? (y.textContent = "")
                  : y.nodeType === 9 &&
                    y.documentElement &&
                    y.removeChild(y.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(A(163));
            }
        } catch (b) {
          ye(t, t.return, b);
        }
        if (((e = t.sibling), e !== null)) {
          ((e.return = t.return), (D = e));
          break;
        }
        D = t.return;
      }
  return ((S = yp), (yp = !1), S);
}
function ws(e, t, n) {
  var r = t.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var o = (r = r.next);
    do {
      if ((o.tag & e) === e) {
        var s = o.destroy;
        ((o.destroy = void 0), s !== void 0 && Vc(t, n, s));
      }
      o = o.next;
    } while (o !== r);
  }
}
function Wl(e, t) {
  if (
    ((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)
  ) {
    var n = (t = t.next);
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function Wc(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == "function" ? t(e) : (t.current = e);
  }
}
function Ag(e) {
  var t = e.alternate;
  (t !== null && ((e.alternate = null), Ag(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null &&
        (delete t[Qt], delete t[Is], delete t[Ac], delete t[eS], delete t[tS])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null));
}
function _g(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function xp(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || _g(e.return)) return null;
      e = e.return;
    }
    for (
      e.sibling.return = e.return, e = e.sibling;
      e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
    ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      ((e.child.return = e), (e = e.child));
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function Kc(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    ((e = e.stateNode),
      t
        ? n.nodeType === 8
          ? n.parentNode.insertBefore(e, t)
          : n.insertBefore(e, t)
        : (n.nodeType === 8
            ? ((t = n.parentNode), t.insertBefore(e, n))
            : ((t = n), t.appendChild(e)),
          (n = n._reactRootContainer),
          n != null || t.onclick !== null || (t.onclick = sl)));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (Kc(e, t, n), e = e.sibling; e !== null; )
      (Kc(e, t, n), (e = e.sibling));
}
function Qc(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (Qc(e, t, n), e = e.sibling; e !== null; )
      (Qc(e, t, n), (e = e.sibling));
}
var Oe = null,
  Pt = !1;
function bn(e, t, n) {
  for (n = n.child; n !== null; ) (Og(e, t, n), (n = n.sibling));
}
function Og(e, t, n) {
  if (Yt && typeof Yt.onCommitFiberUnmount == "function")
    try {
      Yt.onCommitFiberUnmount(Dl, n);
    } catch {}
  switch (n.tag) {
    case 5:
      $e || eo(n, t);
    case 6:
      var r = Oe,
        o = Pt;
      ((Oe = null),
        bn(e, t, n),
        (Oe = r),
        (Pt = o),
        Oe !== null &&
          (Pt
            ? ((e = Oe),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : Oe.removeChild(n.stateNode)));
      break;
    case 18:
      Oe !== null &&
        (Pt
          ? ((e = Oe),
            (n = n.stateNode),
            e.nodeType === 8
              ? Oa(e.parentNode, n)
              : e.nodeType === 1 && Oa(e, n),
            Ts(e))
          : Oa(Oe, n.stateNode));
      break;
    case 4:
      ((r = Oe),
        (o = Pt),
        (Oe = n.stateNode.containerInfo),
        (Pt = !0),
        bn(e, t, n),
        (Oe = r),
        (Pt = o));
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !$e &&
        ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))
      ) {
        o = r = r.next;
        do {
          var s = o,
            i = s.destroy;
          ((s = s.tag),
            i !== void 0 && (s & 2 || s & 4) && Vc(n, t, i),
            (o = o.next));
        } while (o !== r);
      }
      bn(e, t, n);
      break;
    case 1:
      if (
        !$e &&
        (eo(n, t),
        (r = n.stateNode),
        typeof r.componentWillUnmount == "function")
      )
        try {
          ((r.props = n.memoizedProps),
            (r.state = n.memoizedState),
            r.componentWillUnmount());
        } catch (a) {
          ye(n, t, a);
        }
      bn(e, t, n);
      break;
    case 21:
      bn(e, t, n);
      break;
    case 22:
      n.mode & 1
        ? (($e = (r = $e) || n.memoizedState !== null), bn(e, t, n), ($e = r))
        : bn(e, t, n);
      break;
    default:
      bn(e, t, n);
  }
}
function wp(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    (n === null && (n = e.stateNode = new vS()),
      t.forEach(function (r) {
        var o = kS.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(o, o));
      }));
  }
}
function Nt(e, t) {
  var n = t.deletions;
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var o = n[r];
      try {
        var s = e,
          i = t,
          a = i;
        e: for (; a !== null; ) {
          switch (a.tag) {
            case 5:
              ((Oe = a.stateNode), (Pt = !1));
              break e;
            case 3:
              ((Oe = a.stateNode.containerInfo), (Pt = !0));
              break e;
            case 4:
              ((Oe = a.stateNode.containerInfo), (Pt = !0));
              break e;
          }
          a = a.return;
        }
        if (Oe === null) throw Error(A(160));
        (Og(s, i, o), (Oe = null), (Pt = !1));
        var c = o.alternate;
        (c !== null && (c.return = null), (o.return = null));
      } catch (u) {
        ye(o, t, u);
      }
    }
  if (t.subtreeFlags & 12854)
    for (t = t.child; t !== null; ) (Ig(t, e), (t = t.sibling));
}
function Ig(e, t) {
  var n = e.alternate,
    r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((Nt(t, e), Ut(e), r & 4)) {
        try {
          (ws(3, e, e.return), Wl(3, e));
        } catch (v) {
          ye(e, e.return, v);
        }
        try {
          ws(5, e, e.return);
        } catch (v) {
          ye(e, e.return, v);
        }
      }
      break;
    case 1:
      (Nt(t, e), Ut(e), r & 512 && n !== null && eo(n, n.return));
      break;
    case 5:
      if (
        (Nt(t, e),
        Ut(e),
        r & 512 && n !== null && eo(n, n.return),
        e.flags & 32)
      ) {
        var o = e.stateNode;
        try {
          Es(o, "");
        } catch (v) {
          ye(e, e.return, v);
        }
      }
      if (r & 4 && ((o = e.stateNode), o != null)) {
        var s = e.memoizedProps,
          i = n !== null ? n.memoizedProps : s,
          a = e.type,
          c = e.updateQueue;
        if (((e.updateQueue = null), c !== null))
          try {
            (a === "input" && s.type === "radio" && s.name != null && nm(o, s),
              vc(a, i));
            var u = vc(a, s);
            for (i = 0; i < c.length; i += 2) {
              var d = c[i],
                p = c[i + 1];
              d === "style"
                ? lm(o, p)
                : d === "dangerouslySetInnerHTML"
                  ? sm(o, p)
                  : d === "children"
                    ? Es(o, p)
                    : Fu(o, d, p, u);
            }
            switch (a) {
              case "input":
                fc(o, s);
                break;
              case "textarea":
                rm(o, s);
                break;
              case "select":
                var h = o._wrapperState.wasMultiple;
                o._wrapperState.wasMultiple = !!s.multiple;
                var x = s.value;
                x != null
                  ? no(o, !!s.multiple, x, !1)
                  : h !== !!s.multiple &&
                    (s.defaultValue != null
                      ? no(o, !!s.multiple, s.defaultValue, !0)
                      : no(o, !!s.multiple, s.multiple ? [] : "", !1));
            }
            o[Is] = s;
          } catch (v) {
            ye(e, e.return, v);
          }
      }
      break;
    case 6:
      if ((Nt(t, e), Ut(e), r & 4)) {
        if (e.stateNode === null) throw Error(A(162));
        ((o = e.stateNode), (s = e.memoizedProps));
        try {
          o.nodeValue = s;
        } catch (v) {
          ye(e, e.return, v);
        }
      }
      break;
    case 3:
      if (
        (Nt(t, e), Ut(e), r & 4 && n !== null && n.memoizedState.isDehydrated)
      )
        try {
          Ts(t.containerInfo);
        } catch (v) {
          ye(e, e.return, v);
        }
      break;
    case 4:
      (Nt(t, e), Ut(e));
      break;
    case 13:
      (Nt(t, e),
        Ut(e),
        (o = e.child),
        o.flags & 8192 &&
          ((s = o.memoizedState !== null),
          (o.stateNode.isHidden = s),
          !s ||
            (o.alternate !== null && o.alternate.memoizedState !== null) ||
            (vd = Se())),
        r & 4 && wp(e));
      break;
    case 22:
      if (
        ((d = n !== null && n.memoizedState !== null),
        e.mode & 1 ? (($e = (u = $e) || d), Nt(t, e), ($e = u)) : Nt(t, e),
        Ut(e),
        r & 8192)
      ) {
        if (
          ((u = e.memoizedState !== null),
          (e.stateNode.isHidden = u) && !d && e.mode & 1)
        )
          for (D = e, d = e.child; d !== null; ) {
            for (p = D = d; D !== null; ) {
              switch (((h = D), (x = h.child), h.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  ws(4, h, h.return);
                  break;
                case 1:
                  eo(h, h.return);
                  var S = h.stateNode;
                  if (typeof S.componentWillUnmount == "function") {
                    ((r = h), (n = h.return));
                    try {
                      ((t = r),
                        (S.props = t.memoizedProps),
                        (S.state = t.memoizedState),
                        S.componentWillUnmount());
                    } catch (v) {
                      ye(r, n, v);
                    }
                  }
                  break;
                case 5:
                  eo(h, h.return);
                  break;
                case 22:
                  if (h.memoizedState !== null) {
                    bp(p);
                    continue;
                  }
              }
              x !== null ? ((x.return = h), (D = x)) : bp(p);
            }
            d = d.sibling;
          }
        e: for (d = null, p = e; ; ) {
          if (p.tag === 5) {
            if (d === null) {
              d = p;
              try {
                ((o = p.stateNode),
                  u
                    ? ((s = o.style),
                      typeof s.setProperty == "function"
                        ? s.setProperty("display", "none", "important")
                        : (s.display = "none"))
                    : ((a = p.stateNode),
                      (c = p.memoizedProps.style),
                      (i =
                        c != null && c.hasOwnProperty("display")
                          ? c.display
                          : null),
                      (a.style.display = im("display", i))));
              } catch (v) {
                ye(e, e.return, v);
              }
            }
          } else if (p.tag === 6) {
            if (d === null)
              try {
                p.stateNode.nodeValue = u ? "" : p.memoizedProps;
              } catch (v) {
                ye(e, e.return, v);
              }
          } else if (
            ((p.tag !== 22 && p.tag !== 23) ||
              p.memoizedState === null ||
              p === e) &&
            p.child !== null
          ) {
            ((p.child.return = p), (p = p.child));
            continue;
          }
          if (p === e) break e;
          for (; p.sibling === null; ) {
            if (p.return === null || p.return === e) break e;
            (d === p && (d = null), (p = p.return));
          }
          (d === p && (d = null),
            (p.sibling.return = p.return),
            (p = p.sibling));
        }
      }
      break;
    case 19:
      (Nt(t, e), Ut(e), r & 4 && wp(e));
      break;
    case 21:
      break;
    default:
      (Nt(t, e), Ut(e));
  }
}
function Ut(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (_g(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(A(160));
      }
      switch (r.tag) {
        case 5:
          var o = r.stateNode;
          r.flags & 32 && (Es(o, ""), (r.flags &= -33));
          var s = xp(e);
          Qc(e, s, o);
          break;
        case 3:
        case 4:
          var i = r.stateNode.containerInfo,
            a = xp(e);
          Kc(e, a, i);
          break;
        default:
          throw Error(A(161));
      }
    } catch (c) {
      ye(e, e.return, c);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function xS(e, t, n) {
  ((D = e), Mg(e));
}
function Mg(e, t, n) {
  for (var r = (e.mode & 1) !== 0; D !== null; ) {
    var o = D,
      s = o.child;
    if (o.tag === 22 && r) {
      var i = o.memoizedState !== null || Si;
      if (!i) {
        var a = o.alternate,
          c = (a !== null && a.memoizedState !== null) || $e;
        a = Si;
        var u = $e;
        if (((Si = i), ($e = c) && !u))
          for (D = o; D !== null; )
            ((i = D),
              (c = i.child),
              i.tag === 22 && i.memoizedState !== null
                ? Cp(o)
                : c !== null
                  ? ((c.return = i), (D = c))
                  : Cp(o));
        for (; s !== null; ) ((D = s), Mg(s), (s = s.sibling));
        ((D = o), (Si = a), ($e = u));
      }
      Sp(e);
    } else
      o.subtreeFlags & 8772 && s !== null ? ((s.return = o), (D = s)) : Sp(e);
  }
}
function Sp(e) {
  for (; D !== null; ) {
    var t = D;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              $e || Wl(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !$e)
                if (n === null) r.componentDidMount();
                else {
                  var o =
                    t.elementType === t.type
                      ? n.memoizedProps
                      : jt(t.type, n.memoizedProps);
                  r.componentDidUpdate(
                    o,
                    n.memoizedState,
                    r.__reactInternalSnapshotBeforeUpdate,
                  );
                }
              var s = t.updateQueue;
              s !== null && sp(t, s, r);
              break;
            case 3:
              var i = t.updateQueue;
              if (i !== null) {
                if (((n = null), t.child !== null))
                  switch (t.child.tag) {
                    case 5:
                      n = t.child.stateNode;
                      break;
                    case 1:
                      n = t.child.stateNode;
                  }
                sp(t, i, n);
              }
              break;
            case 5:
              var a = t.stateNode;
              if (n === null && t.flags & 4) {
                n = a;
                var c = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    c.autoFocus && n.focus();
                    break;
                  case "img":
                    c.src && (n.src = c.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var u = t.alternate;
                if (u !== null) {
                  var d = u.memoizedState;
                  if (d !== null) {
                    var p = d.dehydrated;
                    p !== null && Ts(p);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(A(163));
          }
        $e || (t.flags & 512 && Wc(t));
      } catch (h) {
        ye(t, t.return, h);
      }
    }
    if (t === e) {
      D = null;
      break;
    }
    if (((n = t.sibling), n !== null)) {
      ((n.return = t.return), (D = n));
      break;
    }
    D = t.return;
  }
}
function bp(e) {
  for (; D !== null; ) {
    var t = D;
    if (t === e) {
      D = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      ((n.return = t.return), (D = n));
      break;
    }
    D = t.return;
  }
}
function Cp(e) {
  for (; D !== null; ) {
    var t = D;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            Wl(4, t);
          } catch (c) {
            ye(t, n, c);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var o = t.return;
            try {
              r.componentDidMount();
            } catch (c) {
              ye(t, o, c);
            }
          }
          var s = t.return;
          try {
            Wc(t);
          } catch (c) {
            ye(t, s, c);
          }
          break;
        case 5:
          var i = t.return;
          try {
            Wc(t);
          } catch (c) {
            ye(t, i, c);
          }
      }
    } catch (c) {
      ye(t, t.return, c);
    }
    if (t === e) {
      D = null;
      break;
    }
    var a = t.sibling;
    if (a !== null) {
      ((a.return = t.return), (D = a));
      break;
    }
    D = t.return;
  }
}
var wS = Math.ceil,
  gl = Sn.ReactCurrentDispatcher,
  md = Sn.ReactCurrentOwner,
  wt = Sn.ReactCurrentBatchConfig,
  ee = 0,
  Ae = null,
  be = null,
  Ie = 0,
  it = 0,
  to = sr(0),
  ke = 0,
  $s = null,
  Tr = 0,
  Kl = 0,
  gd = 0,
  Ss = null,
  Je = null,
  vd = 0,
  Oo = 1 / 0,
  sn = null,
  vl = !1,
  Gc = null,
  Yn = null,
  bi = !1,
  Hn = null,
  yl = 0,
  bs = 0,
  Yc = null,
  Bi = -1,
  Hi = 0;
function Ge() {
  return ee & 6 ? Se() : Bi !== -1 ? Bi : (Bi = Se());
}
function qn(e) {
  return e.mode & 1
    ? ee & 2 && Ie !== 0
      ? Ie & -Ie
      : rS.transition !== null
        ? (Hi === 0 && (Hi = xm()), Hi)
        : ((e = re),
          e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : jm(e.type))),
          e)
    : 1;
}
function _t(e, t, n, r) {
  if (50 < bs) throw ((bs = 0), (Yc = null), Error(A(185)));
  (qs(e, n, r),
    (!(ee & 2) || e !== Ae) &&
      (e === Ae && (!(ee & 2) && (Kl |= n), ke === 4 && _n(e, Ie)),
      rt(e, r),
      n === 1 && ee === 0 && !(t.mode & 1) && ((Oo = Se() + 500), Bl && ir())));
}
function rt(e, t) {
  var n = e.callbackNode;
  r1(e, t);
  var r = tl(e, e === Ae ? Ie : 0);
  if (r === 0)
    (n !== null && _f(n), (e.callbackNode = null), (e.callbackPriority = 0));
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && _f(n), t === 1))
      (e.tag === 0 ? nS(Np.bind(null, e)) : Wm(Np.bind(null, e)),
        Z1(function () {
          !(ee & 6) && ir();
        }),
        (n = null));
    else {
      switch (wm(r)) {
        case 1:
          n = Hu;
          break;
        case 4:
          n = vm;
          break;
        case 16:
          n = el;
          break;
        case 536870912:
          n = ym;
          break;
        default:
          n = el;
      }
      n = Hg(n, Lg.bind(null, e));
    }
    ((e.callbackPriority = t), (e.callbackNode = n));
  }
}
function Lg(e, t) {
  if (((Bi = -1), (Hi = 0), ee & 6)) throw Error(A(327));
  var n = e.callbackNode;
  if (lo() && e.callbackNode !== n) return null;
  var r = tl(e, e === Ae ? Ie : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = xl(e, r);
  else {
    t = r;
    var o = ee;
    ee |= 2;
    var s = Fg();
    (Ae !== e || Ie !== t) && ((sn = null), (Oo = Se() + 500), Nr(e, t));
    do
      try {
        CS();
        break;
      } catch (a) {
        Dg(e, a);
      }
    while (!0);
    (nd(),
      (gl.current = s),
      (ee = o),
      be !== null ? (t = 0) : ((Ae = null), (Ie = 0), (t = ke)));
  }
  if (t !== 0) {
    if (
      (t === 2 && ((o = bc(e)), o !== 0 && ((r = o), (t = qc(e, o)))), t === 1)
    )
      throw ((n = $s), Nr(e, 0), _n(e, r), rt(e, Se()), n);
    if (t === 6) _n(e, r);
    else {
      if (
        ((o = e.current.alternate),
        !(r & 30) &&
          !SS(o) &&
          ((t = xl(e, r)),
          t === 2 && ((s = bc(e)), s !== 0 && ((r = s), (t = qc(e, s)))),
          t === 1))
      )
        throw ((n = $s), Nr(e, 0), _n(e, r), rt(e, Se()), n);
      switch (((e.finishedWork = o), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(A(345));
        case 2:
          ur(e, Je, sn);
          break;
        case 3:
          if (
            (_n(e, r), (r & 130023424) === r && ((t = vd + 500 - Se()), 10 < t))
          ) {
            if (tl(e, 0) !== 0) break;
            if (((o = e.suspendedLanes), (o & r) !== r)) {
              (Ge(), (e.pingedLanes |= e.suspendedLanes & o));
              break;
            }
            e.timeoutHandle = Rc(ur.bind(null, e, Je, sn), t);
            break;
          }
          ur(e, Je, sn);
          break;
        case 4:
          if ((_n(e, r), (r & 4194240) === r)) break;
          for (t = e.eventTimes, o = -1; 0 < r; ) {
            var i = 31 - At(r);
            ((s = 1 << i), (i = t[i]), i > o && (o = i), (r &= ~s));
          }
          if (
            ((r = o),
            (r = Se() - r),
            (r =
              (120 > r
                ? 120
                : 480 > r
                  ? 480
                  : 1080 > r
                    ? 1080
                    : 1920 > r
                      ? 1920
                      : 3e3 > r
                        ? 3e3
                        : 4320 > r
                          ? 4320
                          : 1960 * wS(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = Rc(ur.bind(null, e, Je, sn), r);
            break;
          }
          ur(e, Je, sn);
          break;
        case 5:
          ur(e, Je, sn);
          break;
        default:
          throw Error(A(329));
      }
    }
  }
  return (rt(e, Se()), e.callbackNode === n ? Lg.bind(null, e) : null);
}
function qc(e, t) {
  var n = Ss;
  return (
    e.current.memoizedState.isDehydrated && (Nr(e, t).flags |= 256),
    (e = xl(e, t)),
    e !== 2 && ((t = Je), (Je = n), t !== null && Xc(t)),
    e
  );
}
function Xc(e) {
  Je === null ? (Je = e) : Je.push.apply(Je, e);
}
function SS(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var o = n[r],
            s = o.getSnapshot;
          o = o.value;
          try {
            if (!It(s(), o)) return !1;
          } catch {
            return !1;
          }
        }
    }
    if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
      ((n.return = t), (t = n));
    else {
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
  }
  return !0;
}
function _n(e, t) {
  for (
    t &= ~gd,
      t &= ~Kl,
      e.suspendedLanes |= t,
      e.pingedLanes &= ~t,
      e = e.expirationTimes;
    0 < t;
  ) {
    var n = 31 - At(t),
      r = 1 << n;
    ((e[n] = -1), (t &= ~r));
  }
}
function Np(e) {
  if (ee & 6) throw Error(A(327));
  lo();
  var t = tl(e, 0);
  if (!(t & 1)) return (rt(e, Se()), null);
  var n = xl(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = bc(e);
    r !== 0 && ((t = r), (n = qc(e, r)));
  }
  if (n === 1) throw ((n = $s), Nr(e, 0), _n(e, t), rt(e, Se()), n);
  if (n === 6) throw Error(A(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    ur(e, Je, sn),
    rt(e, Se()),
    null
  );
}
function yd(e, t) {
  var n = ee;
  ee |= 1;
  try {
    return e(t);
  } finally {
    ((ee = n), ee === 0 && ((Oo = Se() + 500), Bl && ir()));
  }
}
function Rr(e) {
  Hn !== null && Hn.tag === 0 && !(ee & 6) && lo();
  var t = ee;
  ee |= 1;
  var n = wt.transition,
    r = re;
  try {
    if (((wt.transition = null), (re = 1), e)) return e();
  } finally {
    ((re = r), (wt.transition = n), (ee = t), !(ee & 6) && ir());
  }
}
function xd() {
  ((it = to.current), fe(to));
}
function Nr(e, t) {
  ((e.finishedWork = null), (e.finishedLanes = 0));
  var n = e.timeoutHandle;
  if ((n !== -1 && ((e.timeoutHandle = -1), X1(n)), be !== null))
    for (n = be.return; n !== null; ) {
      var r = n;
      switch ((Ju(r), r.tag)) {
        case 1:
          ((r = r.type.childContextTypes), r != null && il());
          break;
        case 3:
          (Ao(), fe(tt), fe(Ue), ad());
          break;
        case 5:
          ld(r);
          break;
        case 4:
          Ao();
          break;
        case 13:
          fe(he);
          break;
        case 19:
          fe(he);
          break;
        case 10:
          rd(r.type._context);
          break;
        case 22:
        case 23:
          xd();
      }
      n = n.return;
    }
  if (
    ((Ae = e),
    (be = e = Xn(e.current, null)),
    (Ie = it = t),
    (ke = 0),
    ($s = null),
    (gd = Kl = Tr = 0),
    (Je = Ss = null),
    pr !== null)
  ) {
    for (t = 0; t < pr.length; t++)
      if (((n = pr[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var o = r.next,
          s = n.pending;
        if (s !== null) {
          var i = s.next;
          ((s.next = o), (r.next = i));
        }
        n.pending = r;
      }
    pr = null;
  }
  return e;
}
function Dg(e, t) {
  do {
    var n = be;
    try {
      if ((nd(), (zi.current = ml), hl)) {
        for (var r = me.memoizedState; r !== null; ) {
          var o = r.queue;
          (o !== null && (o.pending = null), (r = r.next));
        }
        hl = !1;
      }
      if (
        ((Pr = 0),
        (Pe = Ee = me = null),
        (xs = !1),
        (Ds = 0),
        (md.current = null),
        n === null || n.return === null)
      ) {
        ((ke = 1), ($s = t), (be = null));
        break;
      }
      e: {
        var s = e,
          i = n.return,
          a = n,
          c = t;
        if (
          ((t = Ie),
          (a.flags |= 32768),
          c !== null && typeof c == "object" && typeof c.then == "function")
        ) {
          var u = c,
            d = a,
            p = d.tag;
          if (!(d.mode & 1) && (p === 0 || p === 11 || p === 15)) {
            var h = d.alternate;
            h
              ? ((d.updateQueue = h.updateQueue),
                (d.memoizedState = h.memoizedState),
                (d.lanes = h.lanes))
              : ((d.updateQueue = null), (d.memoizedState = null));
          }
          var x = dp(i);
          if (x !== null) {
            ((x.flags &= -257),
              fp(x, i, a, s, t),
              x.mode & 1 && up(s, u, t),
              (t = x),
              (c = u));
            var S = t.updateQueue;
            if (S === null) {
              var v = new Set();
              (v.add(c), (t.updateQueue = v));
            } else S.add(c);
            break e;
          } else {
            if (!(t & 1)) {
              (up(s, u, t), wd());
              break e;
            }
            c = Error(A(426));
          }
        } else if (pe && a.mode & 1) {
          var w = dp(i);
          if (w !== null) {
            (!(w.flags & 65536) && (w.flags |= 256),
              fp(w, i, a, s, t),
              ed(_o(c, a)));
            break e;
          }
        }
        ((s = c = _o(c, a)),
          ke !== 4 && (ke = 2),
          Ss === null ? (Ss = [s]) : Ss.push(s),
          (s = i));
        do {
          switch (s.tag) {
            case 3:
              ((s.flags |= 65536), (t &= -t), (s.lanes |= t));
              var g = wg(s, c, t);
              op(s, g);
              break e;
            case 1:
              a = c;
              var m = s.type,
                y = s.stateNode;
              if (
                !(s.flags & 128) &&
                (typeof m.getDerivedStateFromError == "function" ||
                  (y !== null &&
                    typeof y.componentDidCatch == "function" &&
                    (Yn === null || !Yn.has(y))))
              ) {
                ((s.flags |= 65536), (t &= -t), (s.lanes |= t));
                var b = Sg(s, a, t);
                op(s, b);
                break e;
              }
          }
          s = s.return;
        } while (s !== null);
      }
      $g(n);
    } catch (E) {
      ((t = E), be === n && n !== null && (be = n = n.return));
      continue;
    }
    break;
  } while (!0);
}
function Fg() {
  var e = gl.current;
  return ((gl.current = ml), e === null ? ml : e);
}
function wd() {
  ((ke === 0 || ke === 3 || ke === 2) && (ke = 4),
    Ae === null || (!(Tr & 268435455) && !(Kl & 268435455)) || _n(Ae, Ie));
}
function xl(e, t) {
  var n = ee;
  ee |= 2;
  var r = Fg();
  (Ae !== e || Ie !== t) && ((sn = null), Nr(e, t));
  do
    try {
      bS();
      break;
    } catch (o) {
      Dg(e, o);
    }
  while (!0);
  if ((nd(), (ee = n), (gl.current = r), be !== null)) throw Error(A(261));
  return ((Ae = null), (Ie = 0), ke);
}
function bS() {
  for (; be !== null; ) zg(be);
}
function CS() {
  for (; be !== null && !Gw(); ) zg(be);
}
function zg(e) {
  var t = Bg(e.alternate, e, it);
  ((e.memoizedProps = e.pendingProps),
    t === null ? $g(e) : (be = t),
    (md.current = null));
}
function $g(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (((e = t.return), t.flags & 32768)) {
      if (((n = gS(n, t)), n !== null)) {
        ((n.flags &= 32767), (be = n));
        return;
      }
      if (e !== null)
        ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null));
      else {
        ((ke = 6), (be = null));
        return;
      }
    } else if (((n = mS(n, t, it)), n !== null)) {
      be = n;
      return;
    }
    if (((t = t.sibling), t !== null)) {
      be = t;
      return;
    }
    be = t = e;
  } while (t !== null);
  ke === 0 && (ke = 5);
}
function ur(e, t, n) {
  var r = re,
    o = wt.transition;
  try {
    ((wt.transition = null), (re = 1), NS(e, t, n, r));
  } finally {
    ((wt.transition = o), (re = r));
  }
  return null;
}
function NS(e, t, n, r) {
  do lo();
  while (Hn !== null);
  if (ee & 6) throw Error(A(327));
  n = e.finishedWork;
  var o = e.finishedLanes;
  if (n === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
    throw Error(A(177));
  ((e.callbackNode = null), (e.callbackPriority = 0));
  var s = n.lanes | n.childLanes;
  if (
    (o1(e, s),
    e === Ae && ((be = Ae = null), (Ie = 0)),
    (!(n.subtreeFlags & 2064) && !(n.flags & 2064)) ||
      bi ||
      ((bi = !0),
      Hg(el, function () {
        return (lo(), null);
      })),
    (s = (n.flags & 15990) !== 0),
    n.subtreeFlags & 15990 || s)
  ) {
    ((s = wt.transition), (wt.transition = null));
    var i = re;
    re = 1;
    var a = ee;
    ((ee |= 4),
      (md.current = null),
      yS(e, n),
      Ig(n, e),
      V1(Pc),
      (nl = !!kc),
      (Pc = kc = null),
      (e.current = n),
      xS(n),
      Yw(),
      (ee = a),
      (re = i),
      (wt.transition = s));
  } else e.current = n;
  if (
    (bi && ((bi = !1), (Hn = e), (yl = o)),
    (s = e.pendingLanes),
    s === 0 && (Yn = null),
    Zw(n.stateNode),
    rt(e, Se()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++)
      ((o = t[n]), r(o.value, { componentStack: o.stack, digest: o.digest }));
  if (vl) throw ((vl = !1), (e = Gc), (Gc = null), e);
  return (
    yl & 1 && e.tag !== 0 && lo(),
    (s = e.pendingLanes),
    s & 1 ? (e === Yc ? bs++ : ((bs = 0), (Yc = e))) : (bs = 0),
    ir(),
    null
  );
}
function lo() {
  if (Hn !== null) {
    var e = wm(yl),
      t = wt.transition,
      n = re;
    try {
      if (((wt.transition = null), (re = 16 > e ? 16 : e), Hn === null))
        var r = !1;
      else {
        if (((e = Hn), (Hn = null), (yl = 0), ee & 6)) throw Error(A(331));
        var o = ee;
        for (ee |= 4, D = e.current; D !== null; ) {
          var s = D,
            i = s.child;
          if (D.flags & 16) {
            var a = s.deletions;
            if (a !== null) {
              for (var c = 0; c < a.length; c++) {
                var u = a[c];
                for (D = u; D !== null; ) {
                  var d = D;
                  switch (d.tag) {
                    case 0:
                    case 11:
                    case 15:
                      ws(8, d, s);
                  }
                  var p = d.child;
                  if (p !== null) ((p.return = d), (D = p));
                  else
                    for (; D !== null; ) {
                      d = D;
                      var h = d.sibling,
                        x = d.return;
                      if ((Ag(d), d === u)) {
                        D = null;
                        break;
                      }
                      if (h !== null) {
                        ((h.return = x), (D = h));
                        break;
                      }
                      D = x;
                    }
                }
              }
              var S = s.alternate;
              if (S !== null) {
                var v = S.child;
                if (v !== null) {
                  S.child = null;
                  do {
                    var w = v.sibling;
                    ((v.sibling = null), (v = w));
                  } while (v !== null);
                }
              }
              D = s;
            }
          }
          if (s.subtreeFlags & 2064 && i !== null) ((i.return = s), (D = i));
          else
            e: for (; D !== null; ) {
              if (((s = D), s.flags & 2048))
                switch (s.tag) {
                  case 0:
                  case 11:
                  case 15:
                    ws(9, s, s.return);
                }
              var g = s.sibling;
              if (g !== null) {
                ((g.return = s.return), (D = g));
                break e;
              }
              D = s.return;
            }
        }
        var m = e.current;
        for (D = m; D !== null; ) {
          i = D;
          var y = i.child;
          if (i.subtreeFlags & 2064 && y !== null) ((y.return = i), (D = y));
          else
            e: for (i = m; D !== null; ) {
              if (((a = D), a.flags & 2048))
                try {
                  switch (a.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Wl(9, a);
                  }
                } catch (E) {
                  ye(a, a.return, E);
                }
              if (a === i) {
                D = null;
                break e;
              }
              var b = a.sibling;
              if (b !== null) {
                ((b.return = a.return), (D = b));
                break e;
              }
              D = a.return;
            }
        }
        if (
          ((ee = o), ir(), Yt && typeof Yt.onPostCommitFiberRoot == "function")
        )
          try {
            Yt.onPostCommitFiberRoot(Dl, e);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      ((re = n), (wt.transition = t));
    }
  }
  return !1;
}
function Ep(e, t, n) {
  ((t = _o(n, t)),
    (t = wg(e, t, 1)),
    (e = Gn(e, t, 1)),
    (t = Ge()),
    e !== null && (qs(e, 1, t), rt(e, t)));
}
function ye(e, t, n) {
  if (e.tag === 3) Ep(e, e, n);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        Ep(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == "function" ||
          (typeof r.componentDidCatch == "function" &&
            (Yn === null || !Yn.has(r)))
        ) {
          ((e = _o(n, e)),
            (e = Sg(t, e, 1)),
            (t = Gn(t, e, 1)),
            (e = Ge()),
            t !== null && (qs(t, 1, e), rt(t, e)));
          break;
        }
      }
      t = t.return;
    }
}
function ES(e, t, n) {
  var r = e.pingCache;
  (r !== null && r.delete(t),
    (t = Ge()),
    (e.pingedLanes |= e.suspendedLanes & n),
    Ae === e &&
      (Ie & n) === n &&
      (ke === 4 || (ke === 3 && (Ie & 130023424) === Ie && 500 > Se() - vd)
        ? Nr(e, 0)
        : (gd |= n)),
    rt(e, t));
}
function Ug(e, t) {
  t === 0 &&
    (e.mode & 1
      ? ((t = fi), (fi <<= 1), !(fi & 130023424) && (fi = 4194304))
      : (t = 1));
  var n = Ge();
  ((e = gn(e, t)), e !== null && (qs(e, t, n), rt(e, n)));
}
function jS(e) {
  var t = e.memoizedState,
    n = 0;
  (t !== null && (n = t.retryLane), Ug(e, n));
}
function kS(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode,
        o = e.memoizedState;
      o !== null && (n = o.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(A(314));
  }
  (r !== null && r.delete(t), Ug(e, n));
}
var Bg;
Bg = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || tt.current) et = !0;
    else {
      if (!(e.lanes & n) && !(t.flags & 128)) return ((et = !1), hS(e, t, n));
      et = !!(e.flags & 131072);
    }
  else ((et = !1), pe && t.flags & 1048576 && Km(t, cl, t.index));
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type;
      (Ui(e, t), (e = t.pendingProps));
      var o = Po(t, Ue.current);
      (io(t, n), (o = ud(null, t, r, e, o, n)));
      var s = dd();
      return (
        (t.flags |= 1),
        typeof o == "object" &&
        o !== null &&
        typeof o.render == "function" &&
        o.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            nt(r) ? ((s = !0), ll(t)) : (s = !1),
            (t.memoizedState =
              o.state !== null && o.state !== void 0 ? o.state : null),
            sd(t),
            (o.updater = Vl),
            (t.stateNode = o),
            (o._reactInternals = t),
            Dc(t, r, e, n),
            (t = $c(null, t, r, !0, s, n)))
          : ((t.tag = 0), pe && s && Zu(t), Ke(null, t, o, n), (t = t.child)),
        t
      );
    case 16:
      r = t.elementType;
      e: {
        switch (
          (Ui(e, t),
          (e = t.pendingProps),
          (o = r._init),
          (r = o(r._payload)),
          (t.type = r),
          (o = t.tag = TS(r)),
          (e = jt(r, e)),
          o)
        ) {
          case 0:
            t = zc(null, t, r, e, n);
            break e;
          case 1:
            t = mp(null, t, r, e, n);
            break e;
          case 11:
            t = pp(null, t, r, e, n);
            break e;
          case 14:
            t = hp(null, t, r, jt(r.type, e), n);
            break e;
        }
        throw Error(A(306, r, ""));
      }
      return t;
    case 0:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : jt(r, o)),
        zc(e, t, r, o, n)
      );
    case 1:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : jt(r, o)),
        mp(e, t, r, o, n)
      );
    case 3:
      e: {
        if ((Eg(t), e === null)) throw Error(A(387));
        ((r = t.pendingProps),
          (s = t.memoizedState),
          (o = s.element),
          Zm(e, t),
          fl(t, r, null, n));
        var i = t.memoizedState;
        if (((r = i.element), s.isDehydrated))
          if (
            ((s = {
              element: r,
              isDehydrated: !1,
              cache: i.cache,
              pendingSuspenseBoundaries: i.pendingSuspenseBoundaries,
              transitions: i.transitions,
            }),
            (t.updateQueue.baseState = s),
            (t.memoizedState = s),
            t.flags & 256)
          ) {
            ((o = _o(Error(A(423)), t)), (t = gp(e, t, r, n, o)));
            break e;
          } else if (r !== o) {
            ((o = _o(Error(A(424)), t)), (t = gp(e, t, r, n, o)));
            break e;
          } else
            for (
              at = Qn(t.stateNode.containerInfo.firstChild),
                ct = t,
                pe = !0,
                Tt = null,
                n = qm(t, null, r, n),
                t.child = n;
              n;
            )
              ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
        else {
          if ((To(), r === o)) {
            t = vn(e, t, n);
            break e;
          }
          Ke(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        Jm(t),
        e === null && Ic(t),
        (r = t.type),
        (o = t.pendingProps),
        (s = e !== null ? e.memoizedProps : null),
        (i = o.children),
        Tc(r, o) ? (i = null) : s !== null && Tc(r, s) && (t.flags |= 32),
        Ng(e, t),
        Ke(e, t, i, n),
        t.child
      );
    case 6:
      return (e === null && Ic(t), null);
    case 13:
      return jg(e, t, n);
    case 4:
      return (
        id(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = Ro(t, null, r, n)) : Ke(e, t, r, n),
        t.child
      );
    case 11:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : jt(r, o)),
        pp(e, t, r, o, n)
      );
    case 7:
      return (Ke(e, t, t.pendingProps, n), t.child);
    case 8:
      return (Ke(e, t, t.pendingProps.children, n), t.child);
    case 12:
      return (Ke(e, t, t.pendingProps.children, n), t.child);
    case 10:
      e: {
        if (
          ((r = t.type._context),
          (o = t.pendingProps),
          (s = t.memoizedProps),
          (i = o.value),
          ae(ul, r._currentValue),
          (r._currentValue = i),
          s !== null)
        )
          if (It(s.value, i)) {
            if (s.children === o.children && !tt.current) {
              t = vn(e, t, n);
              break e;
            }
          } else
            for (s = t.child, s !== null && (s.return = t); s !== null; ) {
              var a = s.dependencies;
              if (a !== null) {
                i = s.child;
                for (var c = a.firstContext; c !== null; ) {
                  if (c.context === r) {
                    if (s.tag === 1) {
                      ((c = fn(-1, n & -n)), (c.tag = 2));
                      var u = s.updateQueue;
                      if (u !== null) {
                        u = u.shared;
                        var d = u.pending;
                        (d === null
                          ? (c.next = c)
                          : ((c.next = d.next), (d.next = c)),
                          (u.pending = c));
                      }
                    }
                    ((s.lanes |= n),
                      (c = s.alternate),
                      c !== null && (c.lanes |= n),
                      Mc(s.return, n, t),
                      (a.lanes |= n));
                    break;
                  }
                  c = c.next;
                }
              } else if (s.tag === 10) i = s.type === t.type ? null : s.child;
              else if (s.tag === 18) {
                if (((i = s.return), i === null)) throw Error(A(341));
                ((i.lanes |= n),
                  (a = i.alternate),
                  a !== null && (a.lanes |= n),
                  Mc(i, n, t),
                  (i = s.sibling));
              } else i = s.child;
              if (i !== null) i.return = s;
              else
                for (i = s; i !== null; ) {
                  if (i === t) {
                    i = null;
                    break;
                  }
                  if (((s = i.sibling), s !== null)) {
                    ((s.return = i.return), (i = s));
                    break;
                  }
                  i = i.return;
                }
              s = i;
            }
        (Ke(e, t, o.children, n), (t = t.child));
      }
      return t;
    case 9:
      return (
        (o = t.type),
        (r = t.pendingProps.children),
        io(t, n),
        (o = St(o)),
        (r = r(o)),
        (t.flags |= 1),
        Ke(e, t, r, n),
        t.child
      );
    case 14:
      return (
        (r = t.type),
        (o = jt(r, t.pendingProps)),
        (o = jt(r.type, o)),
        hp(e, t, r, o, n)
      );
    case 15:
      return bg(e, t, t.type, t.pendingProps, n);
    case 17:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : jt(r, o)),
        Ui(e, t),
        (t.tag = 1),
        nt(r) ? ((e = !0), ll(t)) : (e = !1),
        io(t, n),
        xg(t, r, o),
        Dc(t, r, o, n),
        $c(null, t, r, !0, e, n)
      );
    case 19:
      return kg(e, t, n);
    case 22:
      return Cg(e, t, n);
  }
  throw Error(A(156, t.tag));
};
function Hg(e, t) {
  return gm(e, t);
}
function PS(e, t, n, r) {
  ((this.tag = e),
    (this.key = n),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = t),
    (this.dependencies =
      this.memoizedState =
      this.updateQueue =
      this.memoizedProps =
        null),
    (this.mode = r),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null));
}
function yt(e, t, n, r) {
  return new PS(e, t, n, r);
}
function Sd(e) {
  return ((e = e.prototype), !(!e || !e.isReactComponent));
}
function TS(e) {
  if (typeof e == "function") return Sd(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === $u)) return 11;
    if (e === Uu) return 14;
  }
  return 2;
}
function Xn(e, t) {
  var n = e.alternate;
  return (
    n === null
      ? ((n = yt(e.tag, t, e.key, e.mode)),
        (n.elementType = e.elementType),
        (n.type = e.type),
        (n.stateNode = e.stateNode),
        (n.alternate = e),
        (e.alternate = n))
      : ((n.pendingProps = t),
        (n.type = e.type),
        (n.flags = 0),
        (n.subtreeFlags = 0),
        (n.deletions = null)),
    (n.flags = e.flags & 14680064),
    (n.childLanes = e.childLanes),
    (n.lanes = e.lanes),
    (n.child = e.child),
    (n.memoizedProps = e.memoizedProps),
    (n.memoizedState = e.memoizedState),
    (n.updateQueue = e.updateQueue),
    (t = e.dependencies),
    (n.dependencies =
      t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (n.sibling = e.sibling),
    (n.index = e.index),
    (n.ref = e.ref),
    n
  );
}
function Vi(e, t, n, r, o, s) {
  var i = 2;
  if (((r = e), typeof e == "function")) Sd(e) && (i = 1);
  else if (typeof e == "string") i = 5;
  else
    e: switch (e) {
      case Wr:
        return Er(n.children, o, s, t);
      case zu:
        ((i = 8), (o |= 8));
        break;
      case lc:
        return (
          (e = yt(12, n, t, o | 2)),
          (e.elementType = lc),
          (e.lanes = s),
          e
        );
      case ac:
        return ((e = yt(13, n, t, o)), (e.elementType = ac), (e.lanes = s), e);
      case cc:
        return ((e = yt(19, n, t, o)), (e.elementType = cc), (e.lanes = s), e);
      case Jh:
        return Ql(n, o, s, t);
      default:
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case Xh:
              i = 10;
              break e;
            case Zh:
              i = 9;
              break e;
            case $u:
              i = 11;
              break e;
            case Uu:
              i = 14;
              break e;
            case Tn:
              ((i = 16), (r = null));
              break e;
          }
        throw Error(A(130, e == null ? e : typeof e, ""));
    }
  return (
    (t = yt(i, n, t, o)),
    (t.elementType = e),
    (t.type = r),
    (t.lanes = s),
    t
  );
}
function Er(e, t, n, r) {
  return ((e = yt(7, e, r, t)), (e.lanes = n), e);
}
function Ql(e, t, n, r) {
  return (
    (e = yt(22, e, r, t)),
    (e.elementType = Jh),
    (e.lanes = n),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function Ua(e, t, n) {
  return ((e = yt(6, e, null, t)), (e.lanes = n), e);
}
function Ba(e, t, n) {
  return (
    (t = yt(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function RS(e, t, n, r, o) {
  ((this.tag = t),
    (this.containerInfo = e),
    (this.finishedWork =
      this.pingCache =
      this.current =
      this.pendingChildren =
        null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = ba(0)),
    (this.expirationTimes = ba(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = ba(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = o),
    (this.mutableSourceEagerHydrationData = null));
}
function bd(e, t, n, r, o, s, i, a, c) {
  return (
    (e = new RS(e, t, n, a, c)),
    t === 1 ? ((t = 1), s === !0 && (t |= 8)) : (t = 0),
    (s = yt(3, null, null, t)),
    (e.current = s),
    (s.stateNode = e),
    (s.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    sd(s),
    e
  );
}
function AS(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: Vr,
    key: r == null ? null : "" + r,
    children: e,
    containerInfo: t,
    implementation: n,
  };
}
function Vg(e) {
  if (!e) return er;
  e = e._reactInternals;
  e: {
    if (Fr(e) !== e || e.tag !== 1) throw Error(A(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (nt(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(A(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (nt(n)) return Vm(e, n, t);
  }
  return t;
}
function Wg(e, t, n, r, o, s, i, a, c) {
  return (
    (e = bd(n, r, !0, e, o, s, i, a, c)),
    (e.context = Vg(null)),
    (n = e.current),
    (r = Ge()),
    (o = qn(n)),
    (s = fn(r, o)),
    (s.callback = t ?? null),
    Gn(n, s, o),
    (e.current.lanes = o),
    qs(e, o, r),
    rt(e, r),
    e
  );
}
function Gl(e, t, n, r) {
  var o = t.current,
    s = Ge(),
    i = qn(o);
  return (
    (n = Vg(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = fn(s, i)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    (e = Gn(o, t, i)),
    e !== null && (_t(e, o, i, s), Fi(e, o, i)),
    i
  );
}
function wl(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function jp(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function Cd(e, t) {
  (jp(e, t), (e = e.alternate) && jp(e, t));
}
function _S() {
  return null;
}
var Kg =
  typeof reportError == "function"
    ? reportError
    : function (e) {
        console.error(e);
      };
function Nd(e) {
  this._internalRoot = e;
}
Yl.prototype.render = Nd.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(A(409));
  Gl(e, t, null, null);
};
Yl.prototype.unmount = Nd.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    (Rr(function () {
      Gl(null, e, null, null);
    }),
      (t[mn] = null));
  }
};
function Yl(e) {
  this._internalRoot = e;
}
Yl.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = Cm();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < An.length && t !== 0 && t < An[n].priority; n++);
    (An.splice(n, 0, e), n === 0 && Em(e));
  }
};
function Ed(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function ql(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
  );
}
function kp() {}
function OS(e, t, n, r, o) {
  if (o) {
    if (typeof r == "function") {
      var s = r;
      r = function () {
        var u = wl(i);
        s.call(u);
      };
    }
    var i = Wg(t, r, e, 0, null, !1, !1, "", kp);
    return (
      (e._reactRootContainer = i),
      (e[mn] = i.current),
      _s(e.nodeType === 8 ? e.parentNode : e),
      Rr(),
      i
    );
  }
  for (; (o = e.lastChild); ) e.removeChild(o);
  if (typeof r == "function") {
    var a = r;
    r = function () {
      var u = wl(c);
      a.call(u);
    };
  }
  var c = bd(e, 0, !1, null, null, !1, !1, "", kp);
  return (
    (e._reactRootContainer = c),
    (e[mn] = c.current),
    _s(e.nodeType === 8 ? e.parentNode : e),
    Rr(function () {
      Gl(t, c, n, r);
    }),
    c
  );
}
function Xl(e, t, n, r, o) {
  var s = n._reactRootContainer;
  if (s) {
    var i = s;
    if (typeof o == "function") {
      var a = o;
      o = function () {
        var c = wl(i);
        a.call(c);
      };
    }
    Gl(t, i, e, o);
  } else i = OS(n, t, e, o, r);
  return wl(i);
}
Sm = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = us(t.pendingLanes);
        n !== 0 &&
          (Vu(t, n | 1), rt(t, Se()), !(ee & 6) && ((Oo = Se() + 500), ir()));
      }
      break;
    case 13:
      (Rr(function () {
        var r = gn(e, 1);
        if (r !== null) {
          var o = Ge();
          _t(r, e, 1, o);
        }
      }),
        Cd(e, 1));
  }
};
Wu = function (e) {
  if (e.tag === 13) {
    var t = gn(e, 134217728);
    if (t !== null) {
      var n = Ge();
      _t(t, e, 134217728, n);
    }
    Cd(e, 134217728);
  }
};
bm = function (e) {
  if (e.tag === 13) {
    var t = qn(e),
      n = gn(e, t);
    if (n !== null) {
      var r = Ge();
      _t(n, e, t, r);
    }
    Cd(e, t);
  }
};
Cm = function () {
  return re;
};
Nm = function (e, t) {
  var n = re;
  try {
    return ((re = e), t());
  } finally {
    re = n;
  }
};
xc = function (e, t, n) {
  switch (t) {
    case "input":
      if ((fc(e, n), (t = n.name), n.type === "radio" && t != null)) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (
          n = n.querySelectorAll(
            "input[name=" + JSON.stringify("" + t) + '][type="radio"]',
          ),
            t = 0;
          t < n.length;
          t++
        ) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var o = Ul(r);
            if (!o) throw Error(A(90));
            (tm(r), fc(r, o));
          }
        }
      }
      break;
    case "textarea":
      rm(e, n);
      break;
    case "select":
      ((t = n.value), t != null && no(e, !!n.multiple, t, !1));
  }
};
um = yd;
dm = Rr;
var IS = { usingClientEntryPoint: !1, Events: [Zs, Yr, Ul, am, cm, yd] },
  ss = {
    findFiberByHostInstance: fr,
    bundleType: 0,
    version: "18.3.1",
    rendererPackageName: "react-dom",
  },
  MS = {
    bundleType: ss.bundleType,
    version: ss.version,
    rendererPackageName: ss.rendererPackageName,
    rendererConfig: ss.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: Sn.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return ((e = hm(e)), e === null ? null : e.stateNode);
    },
    findFiberByHostInstance: ss.findFiberByHostInstance || _S,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var Ci = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!Ci.isDisabled && Ci.supportsFiber)
    try {
      ((Dl = Ci.inject(MS)), (Yt = Ci));
    } catch {}
}
ft.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = IS;
ft.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!Ed(t)) throw Error(A(200));
  return AS(e, t, null, n);
};
ft.createRoot = function (e, t) {
  if (!Ed(e)) throw Error(A(299));
  var n = !1,
    r = "",
    o = Kg;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (o = t.onRecoverableError)),
    (t = bd(e, 1, !1, null, null, n, !1, r, o)),
    (e[mn] = t.current),
    _s(e.nodeType === 8 ? e.parentNode : e),
    new Nd(t)
  );
};
ft.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function"
      ? Error(A(188))
      : ((e = Object.keys(e).join(",")), Error(A(268, e)));
  return ((e = hm(t)), (e = e === null ? null : e.stateNode), e);
};
ft.flushSync = function (e) {
  return Rr(e);
};
ft.hydrate = function (e, t, n) {
  if (!ql(t)) throw Error(A(200));
  return Xl(null, e, t, !0, n);
};
ft.hydrateRoot = function (e, t, n) {
  if (!Ed(e)) throw Error(A(405));
  var r = (n != null && n.hydratedSources) || null,
    o = !1,
    s = "",
    i = Kg;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (o = !0),
      n.identifierPrefix !== void 0 && (s = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (i = n.onRecoverableError)),
    (t = Wg(t, null, e, 1, n ?? null, o, !1, s, i)),
    (e[mn] = t.current),
    _s(e),
    r)
  )
    for (e = 0; e < r.length; e++)
      ((n = r[e]),
        (o = n._getVersion),
        (o = o(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, o])
          : t.mutableSourceEagerHydrationData.push(n, o));
  return new Yl(t);
};
ft.render = function (e, t, n) {
  if (!ql(t)) throw Error(A(200));
  return Xl(null, e, t, !1, n);
};
ft.unmountComponentAtNode = function (e) {
  if (!ql(e)) throw Error(A(40));
  return e._reactRootContainer
    ? (Rr(function () {
        Xl(null, null, e, !1, function () {
          ((e._reactRootContainer = null), (e[mn] = null));
        });
      }),
      !0)
    : !1;
};
ft.unstable_batchedUpdates = yd;
ft.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!ql(n)) throw Error(A(200));
  if (e == null || e._reactInternals === void 0) throw Error(A(38));
  return Xl(e, t, n, !1, r);
};
ft.version = "18.3.1-next-f1338f8080-20240426";
function Qg() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Qg);
    } catch (e) {
      console.error(e);
    }
}
(Qg(), (Qh.exports = ft));
var zr = Qh.exports;
const LS = Ih(zr);
var Gg,
  Pp = zr;
((Gg = Pp.createRoot), Pp.hydrateRoot);
function DS(e, t) {
  if (e instanceof RegExp) return { keys: !1, pattern: e };
  var n,
    r,
    o,
    s,
    i = [],
    a = "",
    c = e.split("/");
  for (c[0] || c.shift(); (o = c.shift()); )
    ((n = o[0]),
      n === "*"
        ? (i.push(n), (a += o[1] === "?" ? "(?:/(.*))?" : "/(.*)"))
        : n === ":"
          ? ((r = o.indexOf("?", 1)),
            (s = o.indexOf(".", 1)),
            i.push(o.substring(1, ~r ? r : ~s ? s : o.length)),
            (a += ~r && !~s ? "(?:/([^/]+?))?" : "/([^/]+?)"),
            ~s && (a += (~r ? "?" : "") + "\\" + o.substring(s)))
          : (a += "/" + o));
  return {
    keys: i,
    pattern: new RegExp("^" + a + (t ? "(?=$|/)" : "/?$"), "i"),
  };
}
var Yg = { exports: {} },
  qg = {};
/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Io = f;
function FS(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var zS = typeof Object.is == "function" ? Object.is : FS,
  $S = Io.useState,
  US = Io.useEffect,
  BS = Io.useLayoutEffect,
  HS = Io.useDebugValue;
function VS(e, t) {
  var n = t(),
    r = $S({ inst: { value: n, getSnapshot: t } }),
    o = r[0].inst,
    s = r[1];
  return (
    BS(
      function () {
        ((o.value = n), (o.getSnapshot = t), Ha(o) && s({ inst: o }));
      },
      [e, n, t],
    ),
    US(
      function () {
        return (
          Ha(o) && s({ inst: o }),
          e(function () {
            Ha(o) && s({ inst: o });
          })
        );
      },
      [e],
    ),
    HS(n),
    n
  );
}
function Ha(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !zS(e, n);
  } catch {
    return !0;
  }
}
function WS(e, t) {
  return t();
}
var KS =
  typeof window > "u" ||
  typeof window.document > "u" ||
  typeof window.document.createElement > "u"
    ? WS
    : VS;
qg.useSyncExternalStore =
  Io.useSyncExternalStore !== void 0 ? Io.useSyncExternalStore : KS;
Yg.exports = qg;
var QS = Yg.exports;
const GS = Wh.useInsertionEffect,
  YS =
    typeof window < "u" &&
    typeof window.document < "u" &&
    typeof window.document.createElement < "u",
  qS = YS ? f.useLayoutEffect : f.useEffect,
  XS = GS || qS,
  Xg = (e) => {
    const t = f.useRef([e, (...n) => t[0](...n)]).current;
    return (
      XS(() => {
        t[0] = e;
      }),
      t[1]
    );
  },
  ZS = "popstate",
  jd = "pushState",
  kd = "replaceState",
  JS = "hashchange",
  Tp = [ZS, jd, kd, JS],
  eb = (e) => {
    for (const t of Tp) addEventListener(t, e);
    return () => {
      for (const t of Tp) removeEventListener(t, e);
    };
  },
  Zg = (e, t) => QS.useSyncExternalStore(eb, e, t),
  tb = () => location.search,
  nb = ({ ssrSearch: e = "" } = {}) => Zg(tb, () => e),
  Rp = () => location.pathname,
  rb = ({ ssrPath: e } = {}) => Zg(Rp, e ? () => e : Rp),
  ob = (e, { replace: t = !1, state: n = null } = {}) =>
    history[t ? kd : jd](n, "", e),
  sb = (e = {}) => [rb(e), ob],
  Ap = Symbol.for("wouter_v3");
if (typeof history < "u" && typeof window[Ap] > "u") {
  for (const e of [jd, kd]) {
    const t = history[e];
    history[e] = function () {
      const n = t.apply(this, arguments),
        r = new Event(e);
      return ((r.arguments = arguments), dispatchEvent(r), n);
    };
  }
  Object.defineProperty(window, Ap, { value: !0 });
}
const ib = (e, t) =>
    t.toLowerCase().indexOf(e.toLowerCase())
      ? "~" + t
      : t.slice(e.length) || "/",
  Jg = (e = "") => (e === "/" ? "" : e),
  lb = (e, t) => (e[0] === "~" ? e.slice(1) : Jg(t) + e),
  ab = (e = "", t) => ib(Zc(Jg(e)), Zc(t)),
  cb = (e) => (e[0] === "?" ? e.slice(1) : e),
  Zc = (e) => {
    try {
      return decodeURI(e);
    } catch {
      return e;
    }
  },
  ub = (e) => Zc(cb(e)),
  ev = {
    hook: sb,
    searchHook: nb,
    parser: DS,
    base: "",
    ssrPath: void 0,
    ssrSearch: void 0,
    hrefs: (e) => e,
  },
  tv = f.createContext(ev),
  Ho = () => f.useContext(tv),
  nv = {},
  rv = f.createContext(nv),
  ov = () => f.useContext(rv),
  Zl = (e) => {
    const [t, n] = e.hook(e);
    return [ab(e.base, t), Xg((r, o) => n(lb(r, e.base), o))];
  },
  Pd = () => Zl(Ho()),
  db = () => {
    const e = Ho();
    return ub(e.searchHook(e));
  },
  sv = (e, t, n, r) => {
    const { pattern: o, keys: s } =
        t instanceof RegExp ? { keys: !1, pattern: t } : e(t || "*", r),
      i = o.exec(n) || [],
      [a, ...c] = i;
    return a !== void 0
      ? [
          !0,
          (() => {
            const u =
              s !== !1
                ? Object.fromEntries(s.map((p, h) => [p, c[h]]))
                : i.groups;
            let d = { ...c };
            return (u && Object.assign(d, u), d);
          })(),
          ...(r ? [a] : []),
        ]
      : [!1, null];
  },
  fb = ({ children: e, ...t }) => {
    var d, p;
    const n = Ho(),
      r = t.hook ? ev : n;
    let o = r;
    const [s, i] = ((d = t.ssrPath) == null ? void 0 : d.split("?")) ?? [];
    (i && ((t.ssrSearch = i), (t.ssrPath = s)),
      (t.hrefs = t.hrefs ?? ((p = t.hook) == null ? void 0 : p.hrefs)));
    let a = f.useRef({}),
      c = a.current,
      u = c;
    for (let h in r) {
      const x = h === "base" ? r[h] + (t[h] || "") : t[h] || r[h];
      (c === u && x !== u[h] && (a.current = u = { ...u }),
        (u[h] = x),
        x !== r[h] && (o = u));
    }
    return f.createElement(tv.Provider, { value: o, children: e });
  },
  _p = ({ children: e, component: t }, n) =>
    t ? f.createElement(t, { params: n }) : typeof e == "function" ? e(n) : e,
  pb = (e) => {
    let t = f.useRef(nv),
      n = t.current;
    for (const r in e) e[r] !== n[r] && (n = e);
    return (Object.keys(e).length === 0 && (n = e), (t.current = n));
  },
  Cn = ({ path: e, nest: t, match: n, ...r }) => {
    const o = Ho(),
      [s] = Zl(o),
      [i, a, c] = n ?? sv(o.parser, e, s, t),
      u = pb({ ...ov(), ...a });
    if (!i) return null;
    const d = c ? f.createElement(fb, { base: c }, _p(r, u)) : _p(r, u);
    return f.createElement(rv.Provider, { value: u, children: d });
  },
  xt = f.forwardRef((e, t) => {
    const n = Ho(),
      [r, o] = Zl(n),
      {
        to: s = "",
        href: i = s,
        onClick: a,
        asChild: c,
        children: u,
        className: d,
        replace: p,
        state: h,
        ...x
      } = e,
      S = Xg((w) => {
        w.ctrlKey ||
          w.metaKey ||
          w.altKey ||
          w.shiftKey ||
          w.button !== 0 ||
          (a == null || a(w),
          w.defaultPrevented || (w.preventDefault(), o(i, e)));
      }),
      v = n.hrefs(i[0] === "~" ? i.slice(1) : n.base + i, n);
    return c && f.isValidElement(u)
      ? f.cloneElement(u, { onClick: S, href: v })
      : f.createElement("a", {
          ...x,
          onClick: S,
          href: v,
          className: d != null && d.call ? d(r === i) : d,
          children: u,
          ref: t,
        });
  }),
  iv = (e) =>
    Array.isArray(e)
      ? e.flatMap((t) => iv(t && t.type === f.Fragment ? t.props.children : t))
      : [e],
  hb = ({ children: e, location: t }) => {
    const n = Ho(),
      [r] = Zl(n);
    for (const o of iv(e)) {
      let s = 0;
      if (
        f.isValidElement(o) &&
        (s = sv(n.parser, o.props.path, t || r, o.props.nest))[0]
      )
        return f.cloneElement(o, { match: s });
    }
    return null;
  };
var Vo = class {
    constructor() {
      ((this.listeners = new Set()),
        (this.subscribe = this.subscribe.bind(this)));
    }
    subscribe(e) {
      return (
        this.listeners.add(e),
        this.onSubscribe(),
        () => {
          (this.listeners.delete(e), this.onUnsubscribe());
        }
      );
    }
    hasListeners() {
      return this.listeners.size > 0;
    }
    onSubscribe() {}
    onUnsubscribe() {}
  },
  Ar = typeof window > "u" || "Deno" in globalThis;
function mt() {}
function mb(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function Jc(e) {
  return typeof e == "number" && e >= 0 && e !== 1 / 0;
}
function lv(e, t) {
  return Math.max(e + (t || 0) - Date.now(), 0);
}
function ao(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function Rt(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function Op(e, t) {
  const {
    type: n = "all",
    exact: r,
    fetchStatus: o,
    predicate: s,
    queryKey: i,
    stale: a,
  } = e;
  if (i) {
    if (r) {
      if (t.queryHash !== Td(i, t.options)) return !1;
    } else if (!Us(t.queryKey, i)) return !1;
  }
  if (n !== "all") {
    const c = t.isActive();
    if ((n === "active" && !c) || (n === "inactive" && c)) return !1;
  }
  return !(
    (typeof a == "boolean" && t.isStale() !== a) ||
    (o && o !== t.state.fetchStatus) ||
    (s && !s(t))
  );
}
function Ip(e, t) {
  const { exact: n, status: r, predicate: o, mutationKey: s } = e;
  if (s) {
    if (!t.options.mutationKey) return !1;
    if (n) {
      if (_r(t.options.mutationKey) !== _r(s)) return !1;
    } else if (!Us(t.options.mutationKey, s)) return !1;
  }
  return !((r && t.state.status !== r) || (o && !o(t)));
}
function Td(e, t) {
  return ((t == null ? void 0 : t.queryKeyHashFn) || _r)(e);
}
function _r(e) {
  return JSON.stringify(e, (t, n) =>
    eu(n)
      ? Object.keys(n)
          .sort()
          .reduce((r, o) => ((r[o] = n[o]), r), {})
      : n,
  );
}
function Us(e, t) {
  return e === t
    ? !0
    : typeof e != typeof t
      ? !1
      : e && t && typeof e == "object" && typeof t == "object"
        ? !Object.keys(t).some((n) => !Us(e[n], t[n]))
        : !1;
}
function av(e, t) {
  if (e === t) return e;
  const n = Mp(e) && Mp(t);
  if (n || (eu(e) && eu(t))) {
    const r = n ? e : Object.keys(e),
      o = r.length,
      s = n ? t : Object.keys(t),
      i = s.length,
      a = n ? [] : {};
    let c = 0;
    for (let u = 0; u < i; u++) {
      const d = n ? u : s[u];
      ((!n && r.includes(d)) || n) && e[d] === void 0 && t[d] === void 0
        ? ((a[d] = void 0), c++)
        : ((a[d] = av(e[d], t[d])), a[d] === e[d] && e[d] !== void 0 && c++);
    }
    return o === i && c === o ? e : a;
  }
  return t;
}
function Sl(e, t) {
  if (!t || Object.keys(e).length !== Object.keys(t).length) return !1;
  for (const n in e) if (e[n] !== t[n]) return !1;
  return !0;
}
function Mp(e) {
  return Array.isArray(e) && e.length === Object.keys(e).length;
}
function eu(e) {
  if (!Lp(e)) return !1;
  const t = e.constructor;
  if (t === void 0) return !0;
  const n = t.prototype;
  return !(
    !Lp(n) ||
    !n.hasOwnProperty("isPrototypeOf") ||
    Object.getPrototypeOf(e) !== Object.prototype
  );
}
function Lp(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
function gb(e) {
  return new Promise((t) => {
    setTimeout(t, e);
  });
}
function tu(e, t, n) {
  return typeof n.structuralSharing == "function"
    ? n.structuralSharing(e, t)
    : n.structuralSharing !== !1
      ? av(e, t)
      : t;
}
function vb(e, t, n = 0) {
  const r = [...e, t];
  return n && r.length > n ? r.slice(1) : r;
}
function yb(e, t, n = 0) {
  const r = [t, ...e];
  return n && r.length > n ? r.slice(0, -1) : r;
}
var Rd = Symbol();
function cv(e, t) {
  return !e.queryFn && t != null && t.initialPromise
    ? () => t.initialPromise
    : !e.queryFn || e.queryFn === Rd
      ? () => Promise.reject(new Error(`Missing queryFn: '${e.queryHash}'`))
      : e.queryFn;
}
var vr,
  On,
  ho,
  Nh,
  xb =
    ((Nh = class extends Vo {
      constructor() {
        super();
        U(this, vr);
        U(this, On);
        U(this, ho);
        L(this, ho, (t) => {
          if (!Ar && window.addEventListener) {
            const n = () => t();
            return (
              window.addEventListener("visibilitychange", n, !1),
              () => {
                window.removeEventListener("visibilitychange", n);
              }
            );
          }
        });
      }
      onSubscribe() {
        C(this, On) || this.setEventListener(C(this, ho));
      }
      onUnsubscribe() {
        var t;
        this.hasListeners() ||
          ((t = C(this, On)) == null || t.call(this), L(this, On, void 0));
      }
      setEventListener(t) {
        var n;
        (L(this, ho, t),
          (n = C(this, On)) == null || n.call(this),
          L(
            this,
            On,
            t((r) => {
              typeof r == "boolean" ? this.setFocused(r) : this.onFocus();
            }),
          ));
      }
      setFocused(t) {
        C(this, vr) !== t && (L(this, vr, t), this.onFocus());
      }
      onFocus() {
        const t = this.isFocused();
        this.listeners.forEach((n) => {
          n(t);
        });
      }
      isFocused() {
        var t;
        return typeof C(this, vr) == "boolean"
          ? C(this, vr)
          : ((t = globalThis.document) == null ? void 0 : t.visibilityState) !==
              "hidden";
      }
    }),
    (vr = new WeakMap()),
    (On = new WeakMap()),
    (ho = new WeakMap()),
    Nh),
  Ad = new xb(),
  mo,
  In,
  go,
  Eh,
  wb =
    ((Eh = class extends Vo {
      constructor() {
        super();
        U(this, mo, !0);
        U(this, In);
        U(this, go);
        L(this, go, (t) => {
          if (!Ar && window.addEventListener) {
            const n = () => t(!0),
              r = () => t(!1);
            return (
              window.addEventListener("online", n, !1),
              window.addEventListener("offline", r, !1),
              () => {
                (window.removeEventListener("online", n),
                  window.removeEventListener("offline", r));
              }
            );
          }
        });
      }
      onSubscribe() {
        C(this, In) || this.setEventListener(C(this, go));
      }
      onUnsubscribe() {
        var t;
        this.hasListeners() ||
          ((t = C(this, In)) == null || t.call(this), L(this, In, void 0));
      }
      setEventListener(t) {
        var n;
        (L(this, go, t),
          (n = C(this, In)) == null || n.call(this),
          L(this, In, t(this.setOnline.bind(this))));
      }
      setOnline(t) {
        C(this, mo) !== t &&
          (L(this, mo, t),
          this.listeners.forEach((r) => {
            r(t);
          }));
      }
      isOnline() {
        return C(this, mo);
      }
    }),
    (mo = new WeakMap()),
    (In = new WeakMap()),
    (go = new WeakMap()),
    Eh),
  bl = new wb();
function nu() {
  let e, t;
  const n = new Promise((o, s) => {
    ((e = o), (t = s));
  });
  ((n.status = "pending"), n.catch(() => {}));
  function r(o) {
    (Object.assign(n, o), delete n.resolve, delete n.reject);
  }
  return (
    (n.resolve = (o) => {
      (r({ status: "fulfilled", value: o }), e(o));
    }),
    (n.reject = (o) => {
      (r({ status: "rejected", reason: o }), t(o));
    }),
    n
  );
}
function Sb(e) {
  return Math.min(1e3 * 2 ** e, 3e4);
}
function uv(e) {
  return (e ?? "online") === "online" ? bl.isOnline() : !0;
}
var dv = class extends Error {
  constructor(e) {
    (super("CancelledError"),
      (this.revert = e == null ? void 0 : e.revert),
      (this.silent = e == null ? void 0 : e.silent));
  }
};
function Va(e) {
  return e instanceof dv;
}
function fv(e) {
  let t = !1,
    n = 0,
    r = !1,
    o;
  const s = nu(),
    i = (v) => {
      var w;
      r || (h(new dv(v)), (w = e.abort) == null || w.call(e));
    },
    a = () => {
      t = !0;
    },
    c = () => {
      t = !1;
    },
    u = () =>
      Ad.isFocused() &&
      (e.networkMode === "always" || bl.isOnline()) &&
      e.canRun(),
    d = () => uv(e.networkMode) && e.canRun(),
    p = (v) => {
      var w;
      r ||
        ((r = !0),
        (w = e.onSuccess) == null || w.call(e, v),
        o == null || o(),
        s.resolve(v));
    },
    h = (v) => {
      var w;
      r ||
        ((r = !0),
        (w = e.onError) == null || w.call(e, v),
        o == null || o(),
        s.reject(v));
    },
    x = () =>
      new Promise((v) => {
        var w;
        ((o = (g) => {
          (r || u()) && v(g);
        }),
          (w = e.onPause) == null || w.call(e));
      }).then(() => {
        var v;
        ((o = void 0), r || (v = e.onContinue) == null || v.call(e));
      }),
    S = () => {
      if (r) return;
      let v;
      const w = n === 0 ? e.initialPromise : void 0;
      try {
        v = w ?? e.fn();
      } catch (g) {
        v = Promise.reject(g);
      }
      Promise.resolve(v)
        .then(p)
        .catch((g) => {
          var k;
          if (r) return;
          const m = e.retry ?? (Ar ? 0 : 3),
            y = e.retryDelay ?? Sb,
            b = typeof y == "function" ? y(n, g) : y,
            E =
              m === !0 ||
              (typeof m == "number" && n < m) ||
              (typeof m == "function" && m(n, g));
          if (t || !E) {
            h(g);
            return;
          }
          (n++,
            (k = e.onFail) == null || k.call(e, n, g),
            gb(b)
              .then(() => (u() ? void 0 : x()))
              .then(() => {
                t ? h(g) : S();
              }));
        });
    };
  return {
    promise: s,
    cancel: i,
    continue: () => (o == null || o(), s),
    cancelRetry: a,
    continueRetry: c,
    canStart: d,
    start: () => (d() ? S() : x().then(S), s),
  };
}
function bb() {
  let e = [],
    t = 0,
    n = (a) => {
      a();
    },
    r = (a) => {
      a();
    },
    o = (a) => setTimeout(a, 0);
  const s = (a) => {
      t
        ? e.push(a)
        : o(() => {
            n(a);
          });
    },
    i = () => {
      const a = e;
      ((e = []),
        a.length &&
          o(() => {
            r(() => {
              a.forEach((c) => {
                n(c);
              });
            });
          }));
    };
  return {
    batch: (a) => {
      let c;
      t++;
      try {
        c = a();
      } finally {
        (t--, t || i());
      }
      return c;
    },
    batchCalls:
      (a) =>
      (...c) => {
        s(() => {
          a(...c);
        });
      },
    schedule: s,
    setNotifyFunction: (a) => {
      n = a;
    },
    setBatchNotifyFunction: (a) => {
      r = a;
    },
    setScheduler: (a) => {
      o = a;
    },
  };
}
var je = bb(),
  yr,
  jh,
  pv =
    ((jh = class {
      constructor() {
        U(this, yr);
      }
      destroy() {
        this.clearGcTimeout();
      }
      scheduleGc() {
        (this.clearGcTimeout(),
          Jc(this.gcTime) &&
            L(
              this,
              yr,
              setTimeout(() => {
                this.optionalRemove();
              }, this.gcTime),
            ));
      }
      updateGcTime(e) {
        this.gcTime = Math.max(
          this.gcTime || 0,
          e ?? (Ar ? 1 / 0 : 5 * 60 * 1e3),
        );
      }
      clearGcTimeout() {
        C(this, yr) && (clearTimeout(C(this, yr)), L(this, yr, void 0));
      }
    }),
    (yr = new WeakMap()),
    jh),
  vo,
  yo,
  ht,
  ze,
  Ws,
  xr,
  kt,
  on,
  kh,
  Cb =
    ((kh = class extends pv {
      constructor(t) {
        super();
        U(this, kt);
        U(this, vo);
        U(this, yo);
        U(this, ht);
        U(this, ze);
        U(this, Ws);
        U(this, xr);
        (L(this, xr, !1),
          L(this, Ws, t.defaultOptions),
          this.setOptions(t.options),
          (this.observers = []),
          L(this, ht, t.cache),
          (this.queryKey = t.queryKey),
          (this.queryHash = t.queryHash),
          L(this, vo, Nb(this.options)),
          (this.state = t.state ?? C(this, vo)),
          this.scheduleGc());
      }
      get meta() {
        return this.options.meta;
      }
      get promise() {
        var t;
        return (t = C(this, ze)) == null ? void 0 : t.promise;
      }
      setOptions(t) {
        ((this.options = { ...C(this, Ws), ...t }),
          this.updateGcTime(this.options.gcTime));
      }
      optionalRemove() {
        !this.observers.length &&
          this.state.fetchStatus === "idle" &&
          C(this, ht).remove(this);
      }
      setData(t, n) {
        const r = tu(this.state.data, t, this.options);
        return (
          Y(this, kt, on).call(this, {
            data: r,
            type: "success",
            dataUpdatedAt: n == null ? void 0 : n.updatedAt,
            manual: n == null ? void 0 : n.manual,
          }),
          r
        );
      }
      setState(t, n) {
        Y(this, kt, on).call(this, {
          type: "setState",
          state: t,
          setStateOptions: n,
        });
      }
      cancel(t) {
        var r, o;
        const n = (r = C(this, ze)) == null ? void 0 : r.promise;
        return (
          (o = C(this, ze)) == null || o.cancel(t),
          n ? n.then(mt).catch(mt) : Promise.resolve()
        );
      }
      destroy() {
        (super.destroy(), this.cancel({ silent: !0 }));
      }
      reset() {
        (this.destroy(), this.setState(C(this, vo)));
      }
      isActive() {
        return this.observers.some((t) => Rt(t.options.enabled, this) !== !1);
      }
      isDisabled() {
        return this.getObserversCount() > 0
          ? !this.isActive()
          : this.options.queryFn === Rd ||
              this.state.dataUpdateCount + this.state.errorUpdateCount === 0;
      }
      isStale() {
        return this.state.isInvalidated
          ? !0
          : this.getObserversCount() > 0
            ? this.observers.some((t) => t.getCurrentResult().isStale)
            : this.state.data === void 0;
      }
      isStaleByTime(t = 0) {
        return (
          this.state.isInvalidated ||
          this.state.data === void 0 ||
          !lv(this.state.dataUpdatedAt, t)
        );
      }
      onFocus() {
        var n;
        const t = this.observers.find((r) => r.shouldFetchOnWindowFocus());
        (t == null || t.refetch({ cancelRefetch: !1 }),
          (n = C(this, ze)) == null || n.continue());
      }
      onOnline() {
        var n;
        const t = this.observers.find((r) => r.shouldFetchOnReconnect());
        (t == null || t.refetch({ cancelRefetch: !1 }),
          (n = C(this, ze)) == null || n.continue());
      }
      addObserver(t) {
        this.observers.includes(t) ||
          (this.observers.push(t),
          this.clearGcTimeout(),
          C(this, ht).notify({
            type: "observerAdded",
            query: this,
            observer: t,
          }));
      }
      removeObserver(t) {
        this.observers.includes(t) &&
          ((this.observers = this.observers.filter((n) => n !== t)),
          this.observers.length ||
            (C(this, ze) &&
              (C(this, xr)
                ? C(this, ze).cancel({ revert: !0 })
                : C(this, ze).cancelRetry()),
            this.scheduleGc()),
          C(this, ht).notify({
            type: "observerRemoved",
            query: this,
            observer: t,
          }));
      }
      getObserversCount() {
        return this.observers.length;
      }
      invalidate() {
        this.state.isInvalidated ||
          Y(this, kt, on).call(this, { type: "invalidate" });
      }
      fetch(t, n) {
        var c, u, d;
        if (this.state.fetchStatus !== "idle") {
          if (this.state.data !== void 0 && n != null && n.cancelRefetch)
            this.cancel({ silent: !0 });
          else if (C(this, ze))
            return (C(this, ze).continueRetry(), C(this, ze).promise);
        }
        if ((t && this.setOptions(t), !this.options.queryFn)) {
          const p = this.observers.find((h) => h.options.queryFn);
          p && this.setOptions(p.options);
        }
        const r = new AbortController(),
          o = (p) => {
            Object.defineProperty(p, "signal", {
              enumerable: !0,
              get: () => (L(this, xr, !0), r.signal),
            });
          },
          s = () => {
            const p = cv(this.options, n),
              h = { queryKey: this.queryKey, meta: this.meta };
            return (
              o(h),
              L(this, xr, !1),
              this.options.persister ? this.options.persister(p, h, this) : p(h)
            );
          },
          i = {
            fetchOptions: n,
            options: this.options,
            queryKey: this.queryKey,
            state: this.state,
            fetchFn: s,
          };
        (o(i),
          (c = this.options.behavior) == null || c.onFetch(i, this),
          L(this, yo, this.state),
          (this.state.fetchStatus === "idle" ||
            this.state.fetchMeta !==
              ((u = i.fetchOptions) == null ? void 0 : u.meta)) &&
            Y(this, kt, on).call(this, {
              type: "fetch",
              meta: (d = i.fetchOptions) == null ? void 0 : d.meta,
            }));
        const a = (p) => {
          var h, x, S, v;
          ((Va(p) && p.silent) ||
            Y(this, kt, on).call(this, { type: "error", error: p }),
            Va(p) ||
              ((x = (h = C(this, ht).config).onError) == null ||
                x.call(h, p, this),
              (v = (S = C(this, ht).config).onSettled) == null ||
                v.call(S, this.state.data, p, this)),
            this.scheduleGc());
        };
        return (
          L(
            this,
            ze,
            fv({
              initialPromise: n == null ? void 0 : n.initialPromise,
              fn: i.fetchFn,
              abort: r.abort.bind(r),
              onSuccess: (p) => {
                var h, x, S, v;
                if (p === void 0) {
                  a(new Error(`${this.queryHash} data is undefined`));
                  return;
                }
                try {
                  this.setData(p);
                } catch (w) {
                  a(w);
                  return;
                }
                ((x = (h = C(this, ht).config).onSuccess) == null ||
                  x.call(h, p, this),
                  (v = (S = C(this, ht).config).onSettled) == null ||
                    v.call(S, p, this.state.error, this),
                  this.scheduleGc());
              },
              onError: a,
              onFail: (p, h) => {
                Y(this, kt, on).call(this, {
                  type: "failed",
                  failureCount: p,
                  error: h,
                });
              },
              onPause: () => {
                Y(this, kt, on).call(this, { type: "pause" });
              },
              onContinue: () => {
                Y(this, kt, on).call(this, { type: "continue" });
              },
              retry: i.options.retry,
              retryDelay: i.options.retryDelay,
              networkMode: i.options.networkMode,
              canRun: () => !0,
            }),
          ),
          C(this, ze).start()
        );
      }
    }),
    (vo = new WeakMap()),
    (yo = new WeakMap()),
    (ht = new WeakMap()),
    (ze = new WeakMap()),
    (Ws = new WeakMap()),
    (xr = new WeakMap()),
    (kt = new WeakSet()),
    (on = function (t) {
      const n = (r) => {
        switch (t.type) {
          case "failed":
            return {
              ...r,
              fetchFailureCount: t.failureCount,
              fetchFailureReason: t.error,
            };
          case "pause":
            return { ...r, fetchStatus: "paused" };
          case "continue":
            return { ...r, fetchStatus: "fetching" };
          case "fetch":
            return {
              ...r,
              ...hv(r.data, this.options),
              fetchMeta: t.meta ?? null,
            };
          case "success":
            return {
              ...r,
              data: t.data,
              dataUpdateCount: r.dataUpdateCount + 1,
              dataUpdatedAt: t.dataUpdatedAt ?? Date.now(),
              error: null,
              isInvalidated: !1,
              status: "success",
              ...(!t.manual && {
                fetchStatus: "idle",
                fetchFailureCount: 0,
                fetchFailureReason: null,
              }),
            };
          case "error":
            const o = t.error;
            return Va(o) && o.revert && C(this, yo)
              ? { ...C(this, yo), fetchStatus: "idle" }
              : {
                  ...r,
                  error: o,
                  errorUpdateCount: r.errorUpdateCount + 1,
                  errorUpdatedAt: Date.now(),
                  fetchFailureCount: r.fetchFailureCount + 1,
                  fetchFailureReason: o,
                  fetchStatus: "idle",
                  status: "error",
                };
          case "invalidate":
            return { ...r, isInvalidated: !0 };
          case "setState":
            return { ...r, ...t.state };
        }
      };
      ((this.state = n(this.state)),
        je.batch(() => {
          (this.observers.forEach((r) => {
            r.onQueryUpdate();
          }),
            C(this, ht).notify({ query: this, type: "updated", action: t }));
        }));
    }),
    kh);
function hv(e, t) {
  return {
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchStatus: uv(t.networkMode) ? "fetching" : "paused",
    ...(e === void 0 && { error: null, status: "pending" }),
  };
}
function Nb(e) {
  const t =
      typeof e.initialData == "function" ? e.initialData() : e.initialData,
    n = t !== void 0,
    r = n
      ? typeof e.initialDataUpdatedAt == "function"
        ? e.initialDataUpdatedAt()
        : e.initialDataUpdatedAt
      : 0;
  return {
    data: t,
    dataUpdateCount: 0,
    dataUpdatedAt: n ? (r ?? Date.now()) : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: !1,
    status: n ? "success" : "pending",
    fetchStatus: "idle",
  };
}
var Ht,
  Ph,
  Eb =
    ((Ph = class extends Vo {
      constructor(t = {}) {
        super();
        U(this, Ht);
        ((this.config = t), L(this, Ht, new Map()));
      }
      build(t, n, r) {
        const o = n.queryKey,
          s = n.queryHash ?? Td(o, n);
        let i = this.get(s);
        return (
          i ||
            ((i = new Cb({
              cache: this,
              queryKey: o,
              queryHash: s,
              options: t.defaultQueryOptions(n),
              state: r,
              defaultOptions: t.getQueryDefaults(o),
            })),
            this.add(i)),
          i
        );
      }
      add(t) {
        C(this, Ht).has(t.queryHash) ||
          (C(this, Ht).set(t.queryHash, t),
          this.notify({ type: "added", query: t }));
      }
      remove(t) {
        const n = C(this, Ht).get(t.queryHash);
        n &&
          (t.destroy(),
          n === t && C(this, Ht).delete(t.queryHash),
          this.notify({ type: "removed", query: t }));
      }
      clear() {
        je.batch(() => {
          this.getAll().forEach((t) => {
            this.remove(t);
          });
        });
      }
      get(t) {
        return C(this, Ht).get(t);
      }
      getAll() {
        return [...C(this, Ht).values()];
      }
      find(t) {
        const n = { exact: !0, ...t };
        return this.getAll().find((r) => Op(n, r));
      }
      findAll(t = {}) {
        const n = this.getAll();
        return Object.keys(t).length > 0 ? n.filter((r) => Op(t, r)) : n;
      }
      notify(t) {
        je.batch(() => {
          this.listeners.forEach((n) => {
            n(t);
          });
        });
      }
      onFocus() {
        je.batch(() => {
          this.getAll().forEach((t) => {
            t.onFocus();
          });
        });
      }
      onOnline() {
        je.batch(() => {
          this.getAll().forEach((t) => {
            t.onOnline();
          });
        });
      }
    }),
    (Ht = new WeakMap()),
    Ph),
  Vt,
  Ve,
  wr,
  Wt,
  kn,
  Th,
  jb =
    ((Th = class extends pv {
      constructor(t) {
        super();
        U(this, Wt);
        U(this, Vt);
        U(this, Ve);
        U(this, wr);
        ((this.mutationId = t.mutationId),
          L(this, Ve, t.mutationCache),
          L(this, Vt, []),
          (this.state = t.state || mv()),
          this.setOptions(t.options),
          this.scheduleGc());
      }
      setOptions(t) {
        ((this.options = t), this.updateGcTime(this.options.gcTime));
      }
      get meta() {
        return this.options.meta;
      }
      addObserver(t) {
        C(this, Vt).includes(t) ||
          (C(this, Vt).push(t),
          this.clearGcTimeout(),
          C(this, Ve).notify({
            type: "observerAdded",
            mutation: this,
            observer: t,
          }));
      }
      removeObserver(t) {
        (L(
          this,
          Vt,
          C(this, Vt).filter((n) => n !== t),
        ),
          this.scheduleGc(),
          C(this, Ve).notify({
            type: "observerRemoved",
            mutation: this,
            observer: t,
          }));
      }
      optionalRemove() {
        C(this, Vt).length ||
          (this.state.status === "pending"
            ? this.scheduleGc()
            : C(this, Ve).remove(this));
      }
      continue() {
        var t;
        return (
          ((t = C(this, wr)) == null ? void 0 : t.continue()) ??
          this.execute(this.state.variables)
        );
      }
      async execute(t) {
        var o, s, i, a, c, u, d, p, h, x, S, v, w, g, m, y, b, E, k, N;
        L(
          this,
          wr,
          fv({
            fn: () =>
              this.options.mutationFn
                ? this.options.mutationFn(t)
                : Promise.reject(new Error("No mutationFn found")),
            onFail: (j, P) => {
              Y(this, Wt, kn).call(this, {
                type: "failed",
                failureCount: j,
                error: P,
              });
            },
            onPause: () => {
              Y(this, Wt, kn).call(this, { type: "pause" });
            },
            onContinue: () => {
              Y(this, Wt, kn).call(this, { type: "continue" });
            },
            retry: this.options.retry ?? 0,
            retryDelay: this.options.retryDelay,
            networkMode: this.options.networkMode,
            canRun: () => C(this, Ve).canRun(this),
          }),
        );
        const n = this.state.status === "pending",
          r = !C(this, wr).canStart();
        try {
          if (!n) {
            (Y(this, Wt, kn).call(this, {
              type: "pending",
              variables: t,
              isPaused: r,
            }),
              await ((s = (o = C(this, Ve).config).onMutate) == null
                ? void 0
                : s.call(o, t, this)));
            const P = await ((a = (i = this.options).onMutate) == null
              ? void 0
              : a.call(i, t));
            P !== this.state.context &&
              Y(this, Wt, kn).call(this, {
                type: "pending",
                context: P,
                variables: t,
                isPaused: r,
              });
          }
          const j = await C(this, wr).start();
          return (
            await ((u = (c = C(this, Ve).config).onSuccess) == null
              ? void 0
              : u.call(c, j, t, this.state.context, this)),
            await ((p = (d = this.options).onSuccess) == null
              ? void 0
              : p.call(d, j, t, this.state.context)),
            await ((x = (h = C(this, Ve).config).onSettled) == null
              ? void 0
              : x.call(
                  h,
                  j,
                  null,
                  this.state.variables,
                  this.state.context,
                  this,
                )),
            await ((v = (S = this.options).onSettled) == null
              ? void 0
              : v.call(S, j, null, t, this.state.context)),
            Y(this, Wt, kn).call(this, { type: "success", data: j }),
            j
          );
        } catch (j) {
          try {
            throw (
              await ((g = (w = C(this, Ve).config).onError) == null
                ? void 0
                : g.call(w, j, t, this.state.context, this)),
              await ((y = (m = this.options).onError) == null
                ? void 0
                : y.call(m, j, t, this.state.context)),
              await ((E = (b = C(this, Ve).config).onSettled) == null
                ? void 0
                : E.call(
                    b,
                    void 0,
                    j,
                    this.state.variables,
                    this.state.context,
                    this,
                  )),
              await ((N = (k = this.options).onSettled) == null
                ? void 0
                : N.call(k, void 0, j, t, this.state.context)),
              j
            );
          } finally {
            Y(this, Wt, kn).call(this, { type: "error", error: j });
          }
        } finally {
          C(this, Ve).runNext(this);
        }
      }
    }),
    (Vt = new WeakMap()),
    (Ve = new WeakMap()),
    (wr = new WeakMap()),
    (Wt = new WeakSet()),
    (kn = function (t) {
      const n = (r) => {
        switch (t.type) {
          case "failed":
            return {
              ...r,
              failureCount: t.failureCount,
              failureReason: t.error,
            };
          case "pause":
            return { ...r, isPaused: !0 };
          case "continue":
            return { ...r, isPaused: !1 };
          case "pending":
            return {
              ...r,
              context: t.context,
              data: void 0,
              failureCount: 0,
              failureReason: null,
              error: null,
              isPaused: t.isPaused,
              status: "pending",
              variables: t.variables,
              submittedAt: Date.now(),
            };
          case "success":
            return {
              ...r,
              data: t.data,
              failureCount: 0,
              failureReason: null,
              error: null,
              status: "success",
              isPaused: !1,
            };
          case "error":
            return {
              ...r,
              data: void 0,
              error: t.error,
              failureCount: r.failureCount + 1,
              failureReason: t.error,
              isPaused: !1,
              status: "error",
            };
        }
      };
      ((this.state = n(this.state)),
        je.batch(() => {
          (C(this, Vt).forEach((r) => {
            r.onMutationUpdate(t);
          }),
            C(this, Ve).notify({ mutation: this, type: "updated", action: t }));
        }));
    }),
    Th);
function mv() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: !1,
    status: "idle",
    variables: void 0,
    submittedAt: 0,
  };
}
var st,
  Ks,
  Rh,
  kb =
    ((Rh = class extends Vo {
      constructor(t = {}) {
        super();
        U(this, st);
        U(this, Ks);
        ((this.config = t), L(this, st, new Map()), L(this, Ks, Date.now()));
      }
      build(t, n, r) {
        const o = new jb({
          mutationCache: this,
          mutationId: ++ii(this, Ks)._,
          options: t.defaultMutationOptions(n),
          state: r,
        });
        return (this.add(o), o);
      }
      add(t) {
        const n = Ni(t),
          r = C(this, st).get(n) ?? [];
        (r.push(t),
          C(this, st).set(n, r),
          this.notify({ type: "added", mutation: t }));
      }
      remove(t) {
        var r;
        const n = Ni(t);
        if (C(this, st).has(n)) {
          const o =
            (r = C(this, st).get(n)) == null
              ? void 0
              : r.filter((s) => s !== t);
          o && (o.length === 0 ? C(this, st).delete(n) : C(this, st).set(n, o));
        }
        this.notify({ type: "removed", mutation: t });
      }
      canRun(t) {
        var r;
        const n =
          (r = C(this, st).get(Ni(t))) == null
            ? void 0
            : r.find((o) => o.state.status === "pending");
        return !n || n === t;
      }
      runNext(t) {
        var r;
        const n =
          (r = C(this, st).get(Ni(t))) == null
            ? void 0
            : r.find((o) => o !== t && o.state.isPaused);
        return (n == null ? void 0 : n.continue()) ?? Promise.resolve();
      }
      clear() {
        je.batch(() => {
          this.getAll().forEach((t) => {
            this.remove(t);
          });
        });
      }
      getAll() {
        return [...C(this, st).values()].flat();
      }
      find(t) {
        const n = { exact: !0, ...t };
        return this.getAll().find((r) => Ip(n, r));
      }
      findAll(t = {}) {
        return this.getAll().filter((n) => Ip(t, n));
      }
      notify(t) {
        je.batch(() => {
          this.listeners.forEach((n) => {
            n(t);
          });
        });
      }
      resumePausedMutations() {
        const t = this.getAll().filter((n) => n.state.isPaused);
        return je.batch(() =>
          Promise.all(t.map((n) => n.continue().catch(mt))),
        );
      }
    }),
    (st = new WeakMap()),
    (Ks = new WeakMap()),
    Rh);
function Ni(e) {
  var t;
  return (
    ((t = e.options.scope) == null ? void 0 : t.id) ?? String(e.mutationId)
  );
}
function Dp(e) {
  return {
    onFetch: (t, n) => {
      var d, p, h, x, S;
      const r = t.options,
        o =
          (h =
            (p = (d = t.fetchOptions) == null ? void 0 : d.meta) == null
              ? void 0
              : p.fetchMore) == null
            ? void 0
            : h.direction,
        s = ((x = t.state.data) == null ? void 0 : x.pages) || [],
        i = ((S = t.state.data) == null ? void 0 : S.pageParams) || [];
      let a = { pages: [], pageParams: [] },
        c = 0;
      const u = async () => {
        let v = !1;
        const w = (y) => {
            Object.defineProperty(y, "signal", {
              enumerable: !0,
              get: () => (
                t.signal.aborted
                  ? (v = !0)
                  : t.signal.addEventListener("abort", () => {
                      v = !0;
                    }),
                t.signal
              ),
            });
          },
          g = cv(t.options, t.fetchOptions),
          m = async (y, b, E) => {
            if (v) return Promise.reject();
            if (b == null && y.pages.length) return Promise.resolve(y);
            const k = {
              queryKey: t.queryKey,
              pageParam: b,
              direction: E ? "backward" : "forward",
              meta: t.options.meta,
            };
            w(k);
            const N = await g(k),
              { maxPages: j } = t.options,
              P = E ? yb : vb;
            return {
              pages: P(y.pages, N, j),
              pageParams: P(y.pageParams, b, j),
            };
          };
        if (o && s.length) {
          const y = o === "backward",
            b = y ? Pb : Fp,
            E = { pages: s, pageParams: i },
            k = b(r, E);
          a = await m(E, k, y);
        } else {
          const y = e ?? s.length;
          do {
            const b = c === 0 ? (i[0] ?? r.initialPageParam) : Fp(r, a);
            if (c > 0 && b == null) break;
            ((a = await m(a, b)), c++);
          } while (c < y);
        }
        return a;
      };
      t.options.persister
        ? (t.fetchFn = () => {
            var v, w;
            return (w = (v = t.options).persister) == null
              ? void 0
              : w.call(
                  v,
                  u,
                  {
                    queryKey: t.queryKey,
                    meta: t.options.meta,
                    signal: t.signal,
                  },
                  n,
                );
          })
        : (t.fetchFn = u);
    },
  };
}
function Fp(e, { pages: t, pageParams: n }) {
  const r = t.length - 1;
  return t.length > 0 ? e.getNextPageParam(t[r], t, n[r], n) : void 0;
}
function Pb(e, { pages: t, pageParams: n }) {
  var r;
  return t.length > 0
    ? (r = e.getPreviousPageParam) == null
      ? void 0
      : r.call(e, t[0], t, n[0], n)
    : void 0;
}
var ve,
  Mn,
  Ln,
  xo,
  wo,
  Dn,
  So,
  bo,
  Ah,
  Tb =
    ((Ah = class {
      constructor(e = {}) {
        U(this, ve);
        U(this, Mn);
        U(this, Ln);
        U(this, xo);
        U(this, wo);
        U(this, Dn);
        U(this, So);
        U(this, bo);
        (L(this, ve, e.queryCache || new Eb()),
          L(this, Mn, e.mutationCache || new kb()),
          L(this, Ln, e.defaultOptions || {}),
          L(this, xo, new Map()),
          L(this, wo, new Map()),
          L(this, Dn, 0));
      }
      mount() {
        (ii(this, Dn)._++,
          C(this, Dn) === 1 &&
            (L(
              this,
              So,
              Ad.subscribe(async (e) => {
                e &&
                  (await this.resumePausedMutations(), C(this, ve).onFocus());
              }),
            ),
            L(
              this,
              bo,
              bl.subscribe(async (e) => {
                e &&
                  (await this.resumePausedMutations(), C(this, ve).onOnline());
              }),
            )));
      }
      unmount() {
        var e, t;
        (ii(this, Dn)._--,
          C(this, Dn) === 0 &&
            ((e = C(this, So)) == null || e.call(this),
            L(this, So, void 0),
            (t = C(this, bo)) == null || t.call(this),
            L(this, bo, void 0)));
      }
      isFetching(e) {
        return C(this, ve).findAll({ ...e, fetchStatus: "fetching" }).length;
      }
      isMutating(e) {
        return C(this, Mn).findAll({ ...e, status: "pending" }).length;
      }
      getQueryData(e) {
        var n;
        const t = this.defaultQueryOptions({ queryKey: e });
        return (n = C(this, ve).get(t.queryHash)) == null
          ? void 0
          : n.state.data;
      }
      ensureQueryData(e) {
        const t = this.getQueryData(e.queryKey);
        if (t === void 0) return this.fetchQuery(e);
        {
          const n = this.defaultQueryOptions(e),
            r = C(this, ve).build(this, n);
          return (
            e.revalidateIfStale &&
              r.isStaleByTime(ao(n.staleTime, r)) &&
              this.prefetchQuery(n),
            Promise.resolve(t)
          );
        }
      }
      getQueriesData(e) {
        return C(this, ve)
          .findAll(e)
          .map(({ queryKey: t, state: n }) => {
            const r = n.data;
            return [t, r];
          });
      }
      setQueryData(e, t, n) {
        const r = this.defaultQueryOptions({ queryKey: e }),
          o = C(this, ve).get(r.queryHash),
          s = o == null ? void 0 : o.state.data,
          i = mb(t, s);
        if (i !== void 0)
          return C(this, ve)
            .build(this, r)
            .setData(i, { ...n, manual: !0 });
      }
      setQueriesData(e, t, n) {
        return je.batch(() =>
          C(this, ve)
            .findAll(e)
            .map(({ queryKey: r }) => [r, this.setQueryData(r, t, n)]),
        );
      }
      getQueryState(e) {
        var n;
        const t = this.defaultQueryOptions({ queryKey: e });
        return (n = C(this, ve).get(t.queryHash)) == null ? void 0 : n.state;
      }
      removeQueries(e) {
        const t = C(this, ve);
        je.batch(() => {
          t.findAll(e).forEach((n) => {
            t.remove(n);
          });
        });
      }
      resetQueries(e, t) {
        const n = C(this, ve),
          r = { type: "active", ...e };
        return je.batch(
          () => (
            n.findAll(e).forEach((o) => {
              o.reset();
            }),
            this.refetchQueries(r, t)
          ),
        );
      }
      cancelQueries(e = {}, t = {}) {
        const n = { revert: !0, ...t },
          r = je.batch(() =>
            C(this, ve)
              .findAll(e)
              .map((o) => o.cancel(n)),
          );
        return Promise.all(r).then(mt).catch(mt);
      }
      invalidateQueries(e = {}, t = {}) {
        return je.batch(() => {
          if (
            (C(this, ve)
              .findAll(e)
              .forEach((r) => {
                r.invalidate();
              }),
            e.refetchType === "none")
          )
            return Promise.resolve();
          const n = { ...e, type: e.refetchType ?? e.type ?? "active" };
          return this.refetchQueries(n, t);
        });
      }
      refetchQueries(e = {}, t) {
        const n = {
            ...t,
            cancelRefetch: (t == null ? void 0 : t.cancelRefetch) ?? !0,
          },
          r = je.batch(() =>
            C(this, ve)
              .findAll(e)
              .filter((o) => !o.isDisabled())
              .map((o) => {
                let s = o.fetch(void 0, n);
                return (
                  n.throwOnError || (s = s.catch(mt)),
                  o.state.fetchStatus === "paused" ? Promise.resolve() : s
                );
              }),
          );
        return Promise.all(r).then(mt);
      }
      fetchQuery(e) {
        const t = this.defaultQueryOptions(e);
        t.retry === void 0 && (t.retry = !1);
        const n = C(this, ve).build(this, t);
        return n.isStaleByTime(ao(t.staleTime, n))
          ? n.fetch(t)
          : Promise.resolve(n.state.data);
      }
      prefetchQuery(e) {
        return this.fetchQuery(e).then(mt).catch(mt);
      }
      fetchInfiniteQuery(e) {
        return ((e.behavior = Dp(e.pages)), this.fetchQuery(e));
      }
      prefetchInfiniteQuery(e) {
        return this.fetchInfiniteQuery(e).then(mt).catch(mt);
      }
      ensureInfiniteQueryData(e) {
        return ((e.behavior = Dp(e.pages)), this.ensureQueryData(e));
      }
      resumePausedMutations() {
        return bl.isOnline()
          ? C(this, Mn).resumePausedMutations()
          : Promise.resolve();
      }
      getQueryCache() {
        return C(this, ve);
      }
      getMutationCache() {
        return C(this, Mn);
      }
      getDefaultOptions() {
        return C(this, Ln);
      }
      setDefaultOptions(e) {
        L(this, Ln, e);
      }
      setQueryDefaults(e, t) {
        C(this, xo).set(_r(e), { queryKey: e, defaultOptions: t });
      }
      getQueryDefaults(e) {
        const t = [...C(this, xo).values()];
        let n = {};
        return (
          t.forEach((r) => {
            Us(e, r.queryKey) && (n = { ...n, ...r.defaultOptions });
          }),
          n
        );
      }
      setMutationDefaults(e, t) {
        C(this, wo).set(_r(e), { mutationKey: e, defaultOptions: t });
      }
      getMutationDefaults(e) {
        const t = [...C(this, wo).values()];
        let n = {};
        return (
          t.forEach((r) => {
            Us(e, r.mutationKey) && (n = { ...n, ...r.defaultOptions });
          }),
          n
        );
      }
      defaultQueryOptions(e) {
        if (e._defaulted) return e;
        const t = {
          ...C(this, Ln).queries,
          ...this.getQueryDefaults(e.queryKey),
          ...e,
          _defaulted: !0,
        };
        return (
          t.queryHash || (t.queryHash = Td(t.queryKey, t)),
          t.refetchOnReconnect === void 0 &&
            (t.refetchOnReconnect = t.networkMode !== "always"),
          t.throwOnError === void 0 && (t.throwOnError = !!t.suspense),
          !t.networkMode && t.persister && (t.networkMode = "offlineFirst"),
          t.enabled !== !0 && t.queryFn === Rd && (t.enabled = !1),
          t
        );
      }
      defaultMutationOptions(e) {
        return e != null && e._defaulted
          ? e
          : {
              ...C(this, Ln).mutations,
              ...((e == null ? void 0 : e.mutationKey) &&
                this.getMutationDefaults(e.mutationKey)),
              ...e,
              _defaulted: !0,
            };
      }
      clear() {
        (C(this, ve).clear(), C(this, Mn).clear());
      }
    }),
    (ve = new WeakMap()),
    (Mn = new WeakMap()),
    (Ln = new WeakMap()),
    (xo = new WeakMap()),
    (wo = new WeakMap()),
    (Dn = new WeakMap()),
    (So = new WeakMap()),
    (bo = new WeakMap()),
    Ah),
  Xe,
  J,
  Qs,
  We,
  Sr,
  Co,
  Fn,
  Kt,
  Gs,
  No,
  Eo,
  br,
  Cr,
  zn,
  jo,
  ne,
  fs,
  ru,
  ou,
  su,
  iu,
  lu,
  au,
  cu,
  gv,
  _h,
  Rb =
    ((_h = class extends Vo {
      constructor(t, n) {
        super();
        U(this, ne);
        U(this, Xe);
        U(this, J);
        U(this, Qs);
        U(this, We);
        U(this, Sr);
        U(this, Co);
        U(this, Fn);
        U(this, Kt);
        U(this, Gs);
        U(this, No);
        U(this, Eo);
        U(this, br);
        U(this, Cr);
        U(this, zn);
        U(this, jo, new Set());
        ((this.options = n),
          L(this, Xe, t),
          L(this, Kt, null),
          L(this, Fn, nu()),
          this.options.experimental_prefetchInRender ||
            C(this, Fn).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled",
              ),
            ),
          this.bindMethods(),
          this.setOptions(n));
      }
      bindMethods() {
        this.refetch = this.refetch.bind(this);
      }
      onSubscribe() {
        this.listeners.size === 1 &&
          (C(this, J).addObserver(this),
          zp(C(this, J), this.options)
            ? Y(this, ne, fs).call(this)
            : this.updateResult(),
          Y(this, ne, iu).call(this));
      }
      onUnsubscribe() {
        this.hasListeners() || this.destroy();
      }
      shouldFetchOnReconnect() {
        return uu(C(this, J), this.options, this.options.refetchOnReconnect);
      }
      shouldFetchOnWindowFocus() {
        return uu(C(this, J), this.options, this.options.refetchOnWindowFocus);
      }
      destroy() {
        ((this.listeners = new Set()),
          Y(this, ne, lu).call(this),
          Y(this, ne, au).call(this),
          C(this, J).removeObserver(this));
      }
      setOptions(t, n) {
        const r = this.options,
          o = C(this, J);
        if (
          ((this.options = C(this, Xe).defaultQueryOptions(t)),
          this.options.enabled !== void 0 &&
            typeof this.options.enabled != "boolean" &&
            typeof this.options.enabled != "function" &&
            typeof Rt(this.options.enabled, C(this, J)) != "boolean")
        )
          throw new Error(
            "Expected enabled to be a boolean or a callback that returns a boolean",
          );
        (Y(this, ne, cu).call(this),
          C(this, J).setOptions(this.options),
          r._defaulted &&
            !Sl(this.options, r) &&
            C(this, Xe)
              .getQueryCache()
              .notify({
                type: "observerOptionsUpdated",
                query: C(this, J),
                observer: this,
              }));
        const s = this.hasListeners();
        (s && $p(C(this, J), o, this.options, r) && Y(this, ne, fs).call(this),
          this.updateResult(n),
          s &&
            (C(this, J) !== o ||
              Rt(this.options.enabled, C(this, J)) !==
                Rt(r.enabled, C(this, J)) ||
              ao(this.options.staleTime, C(this, J)) !==
                ao(r.staleTime, C(this, J))) &&
            Y(this, ne, ru).call(this));
        const i = Y(this, ne, ou).call(this);
        s &&
          (C(this, J) !== o ||
            Rt(this.options.enabled, C(this, J)) !==
              Rt(r.enabled, C(this, J)) ||
            i !== C(this, zn)) &&
          Y(this, ne, su).call(this, i);
      }
      getOptimisticResult(t) {
        const n = C(this, Xe).getQueryCache().build(C(this, Xe), t),
          r = this.createResult(n, t);
        return (
          _b(this, r) &&
            (L(this, We, r),
            L(this, Co, this.options),
            L(this, Sr, C(this, J).state)),
          r
        );
      }
      getCurrentResult() {
        return C(this, We);
      }
      trackResult(t, n) {
        const r = {};
        return (
          Object.keys(t).forEach((o) => {
            Object.defineProperty(r, o, {
              configurable: !1,
              enumerable: !0,
              get: () => (this.trackProp(o), n == null || n(o), t[o]),
            });
          }),
          r
        );
      }
      trackProp(t) {
        C(this, jo).add(t);
      }
      getCurrentQuery() {
        return C(this, J);
      }
      refetch({ ...t } = {}) {
        return this.fetch({ ...t });
      }
      fetchOptimistic(t) {
        const n = C(this, Xe).defaultQueryOptions(t),
          r = C(this, Xe).getQueryCache().build(C(this, Xe), n);
        return r.fetch().then(() => this.createResult(r, n));
      }
      fetch(t) {
        return Y(this, ne, fs)
          .call(this, { ...t, cancelRefetch: t.cancelRefetch ?? !0 })
          .then(() => (this.updateResult(), C(this, We)));
      }
      createResult(t, n) {
        var j;
        const r = C(this, J),
          o = this.options,
          s = C(this, We),
          i = C(this, Sr),
          a = C(this, Co),
          u = t !== r ? t.state : C(this, Qs),
          { state: d } = t;
        let p = { ...d },
          h = !1,
          x;
        if (n._optimisticResults) {
          const P = this.hasListeners(),
            R = !P && zp(t, n),
            M = P && $p(t, r, n, o);
          ((R || M) && (p = { ...p, ...hv(d.data, t.options) }),
            n._optimisticResults === "isRestoring" && (p.fetchStatus = "idle"));
        }
        let { error: S, errorUpdatedAt: v, status: w } = p;
        if (n.select && p.data !== void 0)
          if (
            s &&
            p.data === (i == null ? void 0 : i.data) &&
            n.select === C(this, Gs)
          )
            x = C(this, No);
          else
            try {
              (L(this, Gs, n.select),
                (x = n.select(p.data)),
                (x = tu(s == null ? void 0 : s.data, x, n)),
                L(this, No, x),
                L(this, Kt, null));
            } catch (P) {
              L(this, Kt, P);
            }
        else x = p.data;
        if (n.placeholderData !== void 0 && x === void 0 && w === "pending") {
          let P;
          if (
            s != null &&
            s.isPlaceholderData &&
            n.placeholderData === (a == null ? void 0 : a.placeholderData)
          )
            P = s.data;
          else if (
            ((P =
              typeof n.placeholderData == "function"
                ? n.placeholderData(
                    (j = C(this, Eo)) == null ? void 0 : j.state.data,
                    C(this, Eo),
                  )
                : n.placeholderData),
            n.select && P !== void 0)
          )
            try {
              ((P = n.select(P)), L(this, Kt, null));
            } catch (R) {
              L(this, Kt, R);
            }
          P !== void 0 &&
            ((w = "success"),
            (x = tu(s == null ? void 0 : s.data, P, n)),
            (h = !0));
        }
        C(this, Kt) &&
          ((S = C(this, Kt)),
          (x = C(this, No)),
          (v = Date.now()),
          (w = "error"));
        const g = p.fetchStatus === "fetching",
          m = w === "pending",
          y = w === "error",
          b = m && g,
          E = x !== void 0,
          N = {
            status: w,
            fetchStatus: p.fetchStatus,
            isPending: m,
            isSuccess: w === "success",
            isError: y,
            isInitialLoading: b,
            isLoading: b,
            data: x,
            dataUpdatedAt: p.dataUpdatedAt,
            error: S,
            errorUpdatedAt: v,
            failureCount: p.fetchFailureCount,
            failureReason: p.fetchFailureReason,
            errorUpdateCount: p.errorUpdateCount,
            isFetched: p.dataUpdateCount > 0 || p.errorUpdateCount > 0,
            isFetchedAfterMount:
              p.dataUpdateCount > u.dataUpdateCount ||
              p.errorUpdateCount > u.errorUpdateCount,
            isFetching: g,
            isRefetching: g && !m,
            isLoadingError: y && !E,
            isPaused: p.fetchStatus === "paused",
            isPlaceholderData: h,
            isRefetchError: y && E,
            isStale: _d(t, n),
            refetch: this.refetch,
            promise: C(this, Fn),
          };
        if (this.options.experimental_prefetchInRender) {
          const P = (I) => {
              N.status === "error"
                ? I.reject(N.error)
                : N.data !== void 0 && I.resolve(N.data);
            },
            R = () => {
              const I = L(this, Fn, (N.promise = nu()));
              P(I);
            },
            M = C(this, Fn);
          switch (M.status) {
            case "pending":
              t.queryHash === r.queryHash && P(M);
              break;
            case "fulfilled":
              (N.status === "error" || N.data !== M.value) && R();
              break;
            case "rejected":
              (N.status !== "error" || N.error !== M.reason) && R();
              break;
          }
        }
        return N;
      }
      updateResult(t) {
        const n = C(this, We),
          r = this.createResult(C(this, J), this.options);
        if (
          (L(this, Sr, C(this, J).state),
          L(this, Co, this.options),
          C(this, Sr).data !== void 0 && L(this, Eo, C(this, J)),
          Sl(r, n))
        )
          return;
        L(this, We, r);
        const o = {},
          s = () => {
            if (!n) return !0;
            const { notifyOnChangeProps: i } = this.options,
              a = typeof i == "function" ? i() : i;
            if (a === "all" || (!a && !C(this, jo).size)) return !0;
            const c = new Set(a ?? C(this, jo));
            return (
              this.options.throwOnError && c.add("error"),
              Object.keys(C(this, We)).some((u) => {
                const d = u;
                return C(this, We)[d] !== n[d] && c.has(d);
              })
            );
          };
        ((t == null ? void 0 : t.listeners) !== !1 && s() && (o.listeners = !0),
          Y(this, ne, gv).call(this, { ...o, ...t }));
      }
      onQueryUpdate() {
        (this.updateResult(),
          this.hasListeners() && Y(this, ne, iu).call(this));
      }
    }),
    (Xe = new WeakMap()),
    (J = new WeakMap()),
    (Qs = new WeakMap()),
    (We = new WeakMap()),
    (Sr = new WeakMap()),
    (Co = new WeakMap()),
    (Fn = new WeakMap()),
    (Kt = new WeakMap()),
    (Gs = new WeakMap()),
    (No = new WeakMap()),
    (Eo = new WeakMap()),
    (br = new WeakMap()),
    (Cr = new WeakMap()),
    (zn = new WeakMap()),
    (jo = new WeakMap()),
    (ne = new WeakSet()),
    (fs = function (t) {
      Y(this, ne, cu).call(this);
      let n = C(this, J).fetch(this.options, t);
      return ((t != null && t.throwOnError) || (n = n.catch(mt)), n);
    }),
    (ru = function () {
      Y(this, ne, lu).call(this);
      const t = ao(this.options.staleTime, C(this, J));
      if (Ar || C(this, We).isStale || !Jc(t)) return;
      const r = lv(C(this, We).dataUpdatedAt, t) + 1;
      L(
        this,
        br,
        setTimeout(() => {
          C(this, We).isStale || this.updateResult();
        }, r),
      );
    }),
    (ou = function () {
      return (
        (typeof this.options.refetchInterval == "function"
          ? this.options.refetchInterval(C(this, J))
          : this.options.refetchInterval) ?? !1
      );
    }),
    (su = function (t) {
      (Y(this, ne, au).call(this),
        L(this, zn, t),
        !(
          Ar ||
          Rt(this.options.enabled, C(this, J)) === !1 ||
          !Jc(C(this, zn)) ||
          C(this, zn) === 0
        ) &&
          L(
            this,
            Cr,
            setInterval(
              () => {
                (this.options.refetchIntervalInBackground || Ad.isFocused()) &&
                  Y(this, ne, fs).call(this);
              },
              C(this, zn),
            ),
          ));
    }),
    (iu = function () {
      (Y(this, ne, ru).call(this),
        Y(this, ne, su).call(this, Y(this, ne, ou).call(this)));
    }),
    (lu = function () {
      C(this, br) && (clearTimeout(C(this, br)), L(this, br, void 0));
    }),
    (au = function () {
      C(this, Cr) && (clearInterval(C(this, Cr)), L(this, Cr, void 0));
    }),
    (cu = function () {
      const t = C(this, Xe).getQueryCache().build(C(this, Xe), this.options);
      if (t === C(this, J)) return;
      const n = C(this, J);
      (L(this, J, t),
        L(this, Qs, t.state),
        this.hasListeners() &&
          (n == null || n.removeObserver(this), t.addObserver(this)));
    }),
    (gv = function (t) {
      je.batch(() => {
        (t.listeners &&
          this.listeners.forEach((n) => {
            n(C(this, We));
          }),
          C(this, Xe)
            .getQueryCache()
            .notify({ query: C(this, J), type: "observerResultsUpdated" }));
      });
    }),
    _h);
function Ab(e, t) {
  return (
    Rt(t.enabled, e) !== !1 &&
    e.state.data === void 0 &&
    !(e.state.status === "error" && t.retryOnMount === !1)
  );
}
function zp(e, t) {
  return Ab(e, t) || (e.state.data !== void 0 && uu(e, t, t.refetchOnMount));
}
function uu(e, t, n) {
  if (Rt(t.enabled, e) !== !1) {
    const r = typeof n == "function" ? n(e) : n;
    return r === "always" || (r !== !1 && _d(e, t));
  }
  return !1;
}
function $p(e, t, n, r) {
  return (
    (e !== t || Rt(r.enabled, e) === !1) &&
    (!n.suspense || e.state.status !== "error") &&
    _d(e, n)
  );
}
function _d(e, t) {
  return Rt(t.enabled, e) !== !1 && e.isStaleByTime(ao(t.staleTime, e));
}
function _b(e, t) {
  return !Sl(e.getCurrentResult(), t);
}
var $n,
  Un,
  Ze,
  cn,
  pn,
  Wi,
  du,
  Oh,
  Ob =
    ((Oh = class extends Vo {
      constructor(n, r) {
        super();
        U(this, pn);
        U(this, $n);
        U(this, Un);
        U(this, Ze);
        U(this, cn);
        (L(this, $n, n),
          this.setOptions(r),
          this.bindMethods(),
          Y(this, pn, Wi).call(this));
      }
      bindMethods() {
        ((this.mutate = this.mutate.bind(this)),
          (this.reset = this.reset.bind(this)));
      }
      setOptions(n) {
        var o;
        const r = this.options;
        ((this.options = C(this, $n).defaultMutationOptions(n)),
          Sl(this.options, r) ||
            C(this, $n)
              .getMutationCache()
              .notify({
                type: "observerOptionsUpdated",
                mutation: C(this, Ze),
                observer: this,
              }),
          r != null &&
          r.mutationKey &&
          this.options.mutationKey &&
          _r(r.mutationKey) !== _r(this.options.mutationKey)
            ? this.reset()
            : ((o = C(this, Ze)) == null ? void 0 : o.state.status) ===
                "pending" && C(this, Ze).setOptions(this.options));
      }
      onUnsubscribe() {
        var n;
        this.hasListeners() ||
          (n = C(this, Ze)) == null ||
          n.removeObserver(this);
      }
      onMutationUpdate(n) {
        (Y(this, pn, Wi).call(this), Y(this, pn, du).call(this, n));
      }
      getCurrentResult() {
        return C(this, Un);
      }
      reset() {
        var n;
        ((n = C(this, Ze)) == null || n.removeObserver(this),
          L(this, Ze, void 0),
          Y(this, pn, Wi).call(this),
          Y(this, pn, du).call(this));
      }
      mutate(n, r) {
        var o;
        return (
          L(this, cn, r),
          (o = C(this, Ze)) == null || o.removeObserver(this),
          L(
            this,
            Ze,
            C(this, $n).getMutationCache().build(C(this, $n), this.options),
          ),
          C(this, Ze).addObserver(this),
          C(this, Ze).execute(n)
        );
      }
    }),
    ($n = new WeakMap()),
    (Un = new WeakMap()),
    (Ze = new WeakMap()),
    (cn = new WeakMap()),
    (pn = new WeakSet()),
    (Wi = function () {
      var r;
      const n = ((r = C(this, Ze)) == null ? void 0 : r.state) ?? mv();
      L(this, Un, {
        ...n,
        isPending: n.status === "pending",
        isSuccess: n.status === "success",
        isError: n.status === "error",
        isIdle: n.status === "idle",
        mutate: this.mutate,
        reset: this.reset,
      });
    }),
    (du = function (n) {
      je.batch(() => {
        var r, o, s, i, a, c, u, d;
        if (C(this, cn) && this.hasListeners()) {
          const p = C(this, Un).variables,
            h = C(this, Un).context;
          (n == null ? void 0 : n.type) === "success"
            ? ((o = (r = C(this, cn)).onSuccess) == null ||
                o.call(r, n.data, p, h),
              (i = (s = C(this, cn)).onSettled) == null ||
                i.call(s, n.data, null, p, h))
            : (n == null ? void 0 : n.type) === "error" &&
              ((c = (a = C(this, cn)).onError) == null ||
                c.call(a, n.error, p, h),
              (d = (u = C(this, cn)).onSettled) == null ||
                d.call(u, void 0, n.error, p, h));
        }
        this.listeners.forEach((p) => {
          p(C(this, Un));
        });
      });
    }),
    Oh),
  vv = f.createContext(void 0),
  yv = (e) => {
    const t = f.useContext(vv);
    if (!t)
      throw new Error("No QueryClient set, use QueryClientProvider to set one");
    return t;
  },
  Ib = ({ client: e, children: t }) => (
    f.useEffect(
      () => (
        e.mount(),
        () => {
          e.unmount();
        }
      ),
      [e],
    ),
    l.jsx(vv.Provider, { value: e, children: t })
  ),
  xv = f.createContext(!1),
  Mb = () => f.useContext(xv);
xv.Provider;
function Lb() {
  let e = !1;
  return {
    clearReset: () => {
      e = !1;
    },
    reset: () => {
      e = !0;
    },
    isReset: () => e,
  };
}
var Db = f.createContext(Lb()),
  Fb = () => f.useContext(Db);
function wv(e, t) {
  return typeof e == "function" ? e(...t) : !!e;
}
function fu() {}
var zb = (e, t) => {
    (e.suspense || e.throwOnError || e.experimental_prefetchInRender) &&
      (t.isReset() || (e.retryOnMount = !1));
  },
  $b = (e) => {
    f.useEffect(() => {
      e.clearReset();
    }, [e]);
  },
  Ub = ({ result: e, errorResetBoundary: t, throwOnError: n, query: r }) =>
    e.isError && !t.isReset() && !e.isFetching && r && wv(n, [e.error, r]),
  Bb = (e) => {
    e.suspense &&
      (e.staleTime === void 0 && (e.staleTime = 1e3),
      typeof e.gcTime == "number" && (e.gcTime = Math.max(e.gcTime, 1e3)));
  },
  Hb = (e, t) => e.isLoading && e.isFetching && !t,
  Vb = (e, t) => (e == null ? void 0 : e.suspense) && t.isPending,
  Up = (e, t, n) =>
    t.fetchOptimistic(e).catch(() => {
      n.clearReset();
    });
function Wb(e, t, n) {
  var d, p, h, x, S;
  const r = yv(),
    o = Mb(),
    s = Fb(),
    i = r.defaultQueryOptions(e);
  ((p =
    (d = r.getDefaultOptions().queries) == null
      ? void 0
      : d._experimental_beforeQuery) == null || p.call(d, i),
    (i._optimisticResults = o ? "isRestoring" : "optimistic"),
    Bb(i),
    zb(i, s),
    $b(s));
  const a = !r.getQueryCache().get(i.queryHash),
    [c] = f.useState(() => new t(r, i)),
    u = c.getOptimisticResult(i);
  if (
    (f.useSyncExternalStore(
      f.useCallback(
        (v) => {
          const w = o ? fu : c.subscribe(je.batchCalls(v));
          return (c.updateResult(), w);
        },
        [c, o],
      ),
      () => c.getCurrentResult(),
      () => c.getCurrentResult(),
    ),
    f.useEffect(() => {
      c.setOptions(i, { listeners: !1 });
    }, [i, c]),
    Vb(i, u))
  )
    throw Up(i, c, s);
  if (
    Ub({
      result: u,
      errorResetBoundary: s,
      throwOnError: i.throwOnError,
      query: r.getQueryCache().get(i.queryHash),
    })
  )
    throw u.error;
  if (
    ((x =
      (h = r.getDefaultOptions().queries) == null
        ? void 0
        : h._experimental_afterQuery) == null || x.call(h, i, u),
    i.experimental_prefetchInRender && !Ar && Hb(u, o))
  ) {
    const v = a
      ? Up(i, c, s)
      : (S = r.getQueryCache().get(i.queryHash)) == null
        ? void 0
        : S.promise;
    v == null ||
      v.catch(fu).finally(() => {
        c.updateResult();
      });
  }
  return i.notifyOnChangeProps ? u : c.trackResult(u);
}
function Ot(e, t) {
  return Wb(e, Rb);
}
function Sv(e, t) {
  const n = yv(),
    [r] = f.useState(() => new Ob(n, e));
  f.useEffect(() => {
    r.setOptions(e);
  }, [r, e]);
  const o = f.useSyncExternalStore(
      f.useCallback((i) => r.subscribe(je.batchCalls(i)), [r]),
      () => r.getCurrentResult(),
      () => r.getCurrentResult(),
    ),
    s = f.useCallback(
      (i, a) => {
        r.mutate(i, a).catch(fu);
      },
      [r],
    );
  if (o.error && wv(r.options.throwOnError, [o.error])) throw o.error;
  return { ...o, mutate: s, mutateAsync: o.mutate };
}
async function bv(e) {
  if (!e.ok) {
    const t = (await e.text()) || e.statusText;
    throw new Error(`${e.status}: ${t}`);
  }
}
async function pu(e, t, n) {
  const r = await fetch(t, {
    method: e,
    headers: n ? { "Content-Type": "application/json" } : {},
    body: n ? JSON.stringify(n) : void 0,
    credentials: "include",
  });
  return (await bv(r), r);
}
const Kb =
    ({ on401: e }) =>
    async ({ queryKey: t }) => {
      const n = await fetch(t.join("/"), { credentials: "include" });
      return e === "returnNull" && n.status === 401
        ? null
        : (await bv(n), await n.json());
    },
  Od = new Tb({
    defaultOptions: {
      queries: {
        queryFn: Kb({ on401: "throw" }),
        refetchInterval: !1,
        refetchOnWindowFocus: !1,
        staleTime: 1 / 0,
        retry: !1,
      },
      mutations: { retry: !1 },
    },
  }),
  Qb = 1,
  Gb = 1e6;
let Wa = 0;
function Yb() {
  return ((Wa = (Wa + 1) % Number.MAX_SAFE_INTEGER), Wa.toString());
}
const Ka = new Map(),
  Bp = (e) => {
    if (Ka.has(e)) return;
    const t = setTimeout(() => {
      (Ka.delete(e), Cs({ type: "REMOVE_TOAST", toastId: e }));
    }, Gb);
    Ka.set(e, t);
  },
  qb = (e, t) => {
    switch (t.type) {
      case "ADD_TOAST":
        return { ...e, toasts: [t.toast, ...e.toasts].slice(0, Qb) };
      case "UPDATE_TOAST":
        return {
          ...e,
          toasts: e.toasts.map((n) =>
            n.id === t.toast.id ? { ...n, ...t.toast } : n,
          ),
        };
      case "DISMISS_TOAST": {
        const { toastId: n } = t;
        return (
          n
            ? Bp(n)
            : e.toasts.forEach((r) => {
                Bp(r.id);
              }),
          {
            ...e,
            toasts: e.toasts.map((r) =>
              r.id === n || n === void 0 ? { ...r, open: !1 } : r,
            ),
          }
        );
      }
      case "REMOVE_TOAST":
        return t.toastId === void 0
          ? { ...e, toasts: [] }
          : { ...e, toasts: e.toasts.filter((n) => n.id !== t.toastId) };
    }
  },
  Ki = [];
let Qi = { toasts: [] };
function Cs(e) {
  ((Qi = qb(Qi, e)),
    Ki.forEach((t) => {
      t(Qi);
    }));
}
function Xb({ ...e }) {
  const t = Yb(),
    n = (o) => Cs({ type: "UPDATE_TOAST", toast: { ...o, id: t } }),
    r = () => Cs({ type: "DISMISS_TOAST", toastId: t });
  return (
    Cs({
      type: "ADD_TOAST",
      toast: {
        ...e,
        id: t,
        open: !0,
        onOpenChange: (o) => {
          o || r();
        },
      },
    }),
    { id: t, dismiss: r, update: n }
  );
}
function Zb() {
  const [e, t] = f.useState(Qi);
  return (
    f.useEffect(
      () => (
        Ki.push(t),
        () => {
          const n = Ki.indexOf(t);
          n > -1 && Ki.splice(n, 1);
        }
      ),
      [e],
    ),
    {
      ...e,
      toast: Xb,
      dismiss: (n) => Cs({ type: "DISMISS_TOAST", toastId: n }),
    }
  );
}
function $(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function (o) {
    if ((e == null || e(o), n === !1 || !o.defaultPrevented))
      return t == null ? void 0 : t(o);
  };
}
function Hp(e, t) {
  if (typeof e == "function") return e(t);
  e != null && (e.current = t);
}
function Cv(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const s = Hp(o, t);
      return (!n && typeof s == "function" && (n = !0), s);
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const s = r[o];
          typeof s == "function" ? s() : Hp(e[o], null);
        }
      };
  };
}
function te(...e) {
  return f.useCallback(Cv(...e), e);
}
function Jb(e, t) {
  const n = f.createContext(t),
    r = (s) => {
      const { children: i, ...a } = s,
        c = f.useMemo(() => a, Object.values(a));
      return l.jsx(n.Provider, { value: c, children: i });
    };
  r.displayName = e + "Provider";
  function o(s) {
    const i = f.useContext(n);
    if (i) return i;
    if (t !== void 0) return t;
    throw new Error(`\`${s}\` must be used within \`${e}\``);
  }
  return [r, o];
}
function en(e, t = []) {
  let n = [];
  function r(s, i) {
    const a = f.createContext(i),
      c = n.length;
    n = [...n, i];
    const u = (p) => {
      var g;
      const { scope: h, children: x, ...S } = p,
        v = ((g = h == null ? void 0 : h[e]) == null ? void 0 : g[c]) || a,
        w = f.useMemo(() => S, Object.values(S));
      return l.jsx(v.Provider, { value: w, children: x });
    };
    u.displayName = s + "Provider";
    function d(p, h) {
      var v;
      const x = ((v = h == null ? void 0 : h[e]) == null ? void 0 : v[c]) || a,
        S = f.useContext(x);
      if (S) return S;
      if (i !== void 0) return i;
      throw new Error(`\`${p}\` must be used within \`${s}\``);
    }
    return [u, d];
  }
  const o = () => {
    const s = n.map((i) => f.createContext(i));
    return function (a) {
      const c = (a == null ? void 0 : a[e]) || s;
      return f.useMemo(() => ({ [`__scope${e}`]: { ...a, [e]: c } }), [a, c]);
    };
  };
  return ((o.scopeName = e), [r, eC(o, ...t)]);
}
function eC(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = () => {
    const r = e.map((o) => ({ useScope: o(), scopeName: o.scopeName }));
    return function (s) {
      const i = r.reduce((a, { useScope: c, scopeName: u }) => {
        const p = c(s)[`__scope${u}`];
        return { ...a, ...p };
      }, {});
      return f.useMemo(() => ({ [`__scope${t.scopeName}`]: i }), [i]);
    };
  };
  return ((n.scopeName = t.scopeName), n);
}
function Mo(e) {
  const t = nC(e),
    n = f.forwardRef((r, o) => {
      const { children: s, ...i } = r,
        a = f.Children.toArray(s),
        c = a.find(oC);
      if (c) {
        const u = c.props.children,
          d = a.map((p) =>
            p === c
              ? f.Children.count(u) > 1
                ? f.Children.only(null)
                : f.isValidElement(u)
                  ? u.props.children
                  : null
              : p,
          );
        return l.jsx(t, {
          ...i,
          ref: o,
          children: f.isValidElement(u) ? f.cloneElement(u, void 0, d) : null,
        });
      }
      return l.jsx(t, { ...i, ref: o, children: s });
    });
  return ((n.displayName = `${e}.Slot`), n);
}
var tC = Mo("Slot");
function nC(e) {
  const t = f.forwardRef((n, r) => {
    const { children: o, ...s } = n;
    if (f.isValidElement(o)) {
      const i = iC(o),
        a = sC(s, o.props);
      return (
        o.type !== f.Fragment && (a.ref = r ? Cv(r, i) : i),
        f.cloneElement(o, a)
      );
    }
    return f.Children.count(o) > 1 ? f.Children.only(null) : null;
  });
  return ((t.displayName = `${e}.SlotClone`), t);
}
var Nv = Symbol("radix.slottable");
function rC(e) {
  const t = ({ children: n }) => l.jsx(l.Fragment, { children: n });
  return ((t.displayName = `${e}.Slottable`), (t.__radixId = Nv), t);
}
function oC(e) {
  return (
    f.isValidElement(e) &&
    typeof e.type == "function" &&
    "__radixId" in e.type &&
    e.type.__radixId === Nv
  );
}
function sC(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r],
      s = t[r];
    /^on[A-Z]/.test(r)
      ? o && s
        ? (n[r] = (...a) => {
            (s(...a), o(...a));
          })
        : o && (n[r] = o)
      : r === "style"
        ? (n[r] = { ...o, ...s })
        : r === "className" && (n[r] = [o, s].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function iC(e) {
  var r, o;
  let t =
      (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null
        ? void 0
        : r.get,
    n = t && "isReactWarning" in t && t.isReactWarning;
  return n
    ? e.ref
    : ((t =
        (o = Object.getOwnPropertyDescriptor(e, "ref")) == null
          ? void 0
          : o.get),
      (n = t && "isReactWarning" in t && t.isReactWarning),
      n ? e.props.ref : e.props.ref || e.ref);
}
function Id(e) {
  const t = e + "CollectionProvider",
    [n, r] = en(t),
    [o, s] = n(t, { collectionRef: { current: null }, itemMap: new Map() }),
    i = (v) => {
      const { scope: w, children: g } = v,
        m = Qe.useRef(null),
        y = Qe.useRef(new Map()).current;
      return l.jsx(o, { scope: w, itemMap: y, collectionRef: m, children: g });
    };
  i.displayName = t;
  const a = e + "CollectionSlot",
    c = Mo(a),
    u = Qe.forwardRef((v, w) => {
      const { scope: g, children: m } = v,
        y = s(a, g),
        b = te(w, y.collectionRef);
      return l.jsx(c, { ref: b, children: m });
    });
  u.displayName = a;
  const d = e + "CollectionItemSlot",
    p = "data-radix-collection-item",
    h = Mo(d),
    x = Qe.forwardRef((v, w) => {
      const { scope: g, children: m, ...y } = v,
        b = Qe.useRef(null),
        E = te(w, b),
        k = s(d, g);
      return (
        Qe.useEffect(
          () => (
            k.itemMap.set(b, { ref: b, ...y }),
            () => void k.itemMap.delete(b)
          ),
        ),
        l.jsx(h, { [p]: "", ref: E, children: m })
      );
    });
  x.displayName = d;
  function S(v) {
    const w = s(e + "CollectionConsumer", v);
    return Qe.useCallback(() => {
      const m = w.collectionRef.current;
      if (!m) return [];
      const y = Array.from(m.querySelectorAll(`[${p}]`));
      return Array.from(w.itemMap.values()).sort(
        (k, N) => y.indexOf(k.ref.current) - y.indexOf(N.ref.current),
      );
    }, [w.collectionRef, w.itemMap]);
  }
  return [{ Provider: i, Slot: u, ItemSlot: x }, S, r];
}
var lC = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "span",
    "svg",
    "ul",
  ],
  H = lC.reduce((e, t) => {
    const n = Mo(`Primitive.${t}`),
      r = f.forwardRef((o, s) => {
        const { asChild: i, ...a } = o,
          c = i ? n : t;
        return (
          typeof window < "u" && (window[Symbol.for("radix-ui")] = !0),
          l.jsx(c, { ...a, ref: s })
        );
      });
    return ((r.displayName = `Primitive.${t}`), { ...e, [t]: r });
  }, {});
function Ev(e, t) {
  e && zr.flushSync(() => e.dispatchEvent(t));
}
function xe(e) {
  const t = f.useRef(e);
  return (
    f.useEffect(() => {
      t.current = e;
    }),
    f.useMemo(
      () =>
        (...n) => {
          var r;
          return (r = t.current) == null ? void 0 : r.call(t, ...n);
        },
      [],
    )
  );
}
function aC(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = xe(e);
  f.useEffect(() => {
    const r = (o) => {
      o.key === "Escape" && n(o);
    };
    return (
      t.addEventListener("keydown", r, { capture: !0 }),
      () => t.removeEventListener("keydown", r, { capture: !0 })
    );
  }, [n, t]);
}
var cC = "DismissableLayer",
  hu = "dismissableLayer.update",
  uC = "dismissableLayer.pointerDownOutside",
  dC = "dismissableLayer.focusOutside",
  Vp,
  jv = f.createContext({
    layers: new Set(),
    layersWithOutsidePointerEventsDisabled: new Set(),
    branches: new Set(),
  }),
  ei = f.forwardRef((e, t) => {
    const {
        disableOutsidePointerEvents: n = !1,
        onEscapeKeyDown: r,
        onPointerDownOutside: o,
        onFocusOutside: s,
        onInteractOutside: i,
        onDismiss: a,
        ...c
      } = e,
      u = f.useContext(jv),
      [d, p] = f.useState(null),
      h =
        (d == null ? void 0 : d.ownerDocument) ??
        (globalThis == null ? void 0 : globalThis.document),
      [, x] = f.useState({}),
      S = te(t, (N) => p(N)),
      v = Array.from(u.layers),
      [w] = [...u.layersWithOutsidePointerEventsDisabled].slice(-1),
      g = v.indexOf(w),
      m = d ? v.indexOf(d) : -1,
      y = u.layersWithOutsidePointerEventsDisabled.size > 0,
      b = m >= g,
      E = pC((N) => {
        const j = N.target,
          P = [...u.branches].some((R) => R.contains(j));
        !b ||
          P ||
          (o == null || o(N),
          i == null || i(N),
          N.defaultPrevented || a == null || a());
      }, h),
      k = hC((N) => {
        const j = N.target;
        [...u.branches].some((R) => R.contains(j)) ||
          (s == null || s(N),
          i == null || i(N),
          N.defaultPrevented || a == null || a());
      }, h);
    return (
      aC((N) => {
        m === u.layers.size - 1 &&
          (r == null || r(N),
          !N.defaultPrevented && a && (N.preventDefault(), a()));
      }, h),
      f.useEffect(() => {
        if (d)
          return (
            n &&
              (u.layersWithOutsidePointerEventsDisabled.size === 0 &&
                ((Vp = h.body.style.pointerEvents),
                (h.body.style.pointerEvents = "none")),
              u.layersWithOutsidePointerEventsDisabled.add(d)),
            u.layers.add(d),
            Wp(),
            () => {
              n &&
                u.layersWithOutsidePointerEventsDisabled.size === 1 &&
                (h.body.style.pointerEvents = Vp);
            }
          );
      }, [d, h, n, u]),
      f.useEffect(
        () => () => {
          d &&
            (u.layers.delete(d),
            u.layersWithOutsidePointerEventsDisabled.delete(d),
            Wp());
        },
        [d, u],
      ),
      f.useEffect(() => {
        const N = () => x({});
        return (
          document.addEventListener(hu, N),
          () => document.removeEventListener(hu, N)
        );
      }, []),
      l.jsx(H.div, {
        ...c,
        ref: S,
        style: {
          pointerEvents: y ? (b ? "auto" : "none") : void 0,
          ...e.style,
        },
        onFocusCapture: $(e.onFocusCapture, k.onFocusCapture),
        onBlurCapture: $(e.onBlurCapture, k.onBlurCapture),
        onPointerDownCapture: $(e.onPointerDownCapture, E.onPointerDownCapture),
      })
    );
  });
ei.displayName = cC;
var fC = "DismissableLayerBranch",
  kv = f.forwardRef((e, t) => {
    const n = f.useContext(jv),
      r = f.useRef(null),
      o = te(t, r);
    return (
      f.useEffect(() => {
        const s = r.current;
        if (s)
          return (
            n.branches.add(s),
            () => {
              n.branches.delete(s);
            }
          );
      }, [n.branches]),
      l.jsx(H.div, { ...e, ref: o })
    );
  });
kv.displayName = fC;
function pC(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = xe(e),
    r = f.useRef(!1),
    o = f.useRef(() => {});
  return (
    f.useEffect(() => {
      const s = (a) => {
          if (a.target && !r.current) {
            let c = function () {
              Pv(uC, n, u, { discrete: !0 });
            };
            const u = { originalEvent: a };
            a.pointerType === "touch"
              ? (t.removeEventListener("click", o.current),
                (o.current = c),
                t.addEventListener("click", o.current, { once: !0 }))
              : c();
          } else t.removeEventListener("click", o.current);
          r.current = !1;
        },
        i = window.setTimeout(() => {
          t.addEventListener("pointerdown", s);
        }, 0);
      return () => {
        (window.clearTimeout(i),
          t.removeEventListener("pointerdown", s),
          t.removeEventListener("click", o.current));
      };
    }, [t, n]),
    { onPointerDownCapture: () => (r.current = !0) }
  );
}
function hC(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = xe(e),
    r = f.useRef(!1);
  return (
    f.useEffect(() => {
      const o = (s) => {
        s.target &&
          !r.current &&
          Pv(dC, n, { originalEvent: s }, { discrete: !1 });
      };
      return (
        t.addEventListener("focusin", o),
        () => t.removeEventListener("focusin", o)
      );
    }, [t, n]),
    {
      onFocusCapture: () => (r.current = !0),
      onBlurCapture: () => (r.current = !1),
    }
  );
}
function Wp() {
  const e = new CustomEvent(hu);
  document.dispatchEvent(e);
}
function Pv(e, t, n, { discrete: r }) {
  const o = n.originalEvent.target,
    s = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  (t && o.addEventListener(e, t, { once: !0 }),
    r ? Ev(o, s) : o.dispatchEvent(s));
}
var mC = ei,
  gC = kv,
  Ce = globalThis != null && globalThis.document ? f.useLayoutEffect : () => {},
  vC = "Portal",
  Jl = f.forwardRef((e, t) => {
    var a;
    const { container: n, ...r } = e,
      [o, s] = f.useState(!1);
    Ce(() => s(!0), []);
    const i =
      n ||
      (o &&
        ((a = globalThis == null ? void 0 : globalThis.document) == null
          ? void 0
          : a.body));
    return i ? LS.createPortal(l.jsx(H.div, { ...r, ref: t }), i) : null;
  });
Jl.displayName = vC;
function yC(e, t) {
  return f.useReducer((n, r) => t[n][r] ?? n, e);
}
var Dt = (e) => {
  const { present: t, children: n } = e,
    r = xC(t),
    o =
      typeof n == "function" ? n({ present: r.isPresent }) : f.Children.only(n),
    s = te(r.ref, wC(o));
  return typeof n == "function" || r.isPresent
    ? f.cloneElement(o, { ref: s })
    : null;
};
Dt.displayName = "Presence";
function xC(e) {
  const [t, n] = f.useState(),
    r = f.useRef({}),
    o = f.useRef(e),
    s = f.useRef("none"),
    i = e ? "mounted" : "unmounted",
    [a, c] = yC(i, {
      mounted: { UNMOUNT: "unmounted", ANIMATION_OUT: "unmountSuspended" },
      unmountSuspended: { MOUNT: "mounted", ANIMATION_END: "unmounted" },
      unmounted: { MOUNT: "mounted" },
    });
  return (
    f.useEffect(() => {
      const u = Ei(r.current);
      s.current = a === "mounted" ? u : "none";
    }, [a]),
    Ce(() => {
      const u = r.current,
        d = o.current;
      if (d !== e) {
        const h = s.current,
          x = Ei(u);
        (e
          ? c("MOUNT")
          : x === "none" || (u == null ? void 0 : u.display) === "none"
            ? c("UNMOUNT")
            : c(d && h !== x ? "ANIMATION_OUT" : "UNMOUNT"),
          (o.current = e));
      }
    }, [e, c]),
    Ce(() => {
      if (t) {
        let u;
        const d = t.ownerDocument.defaultView ?? window,
          p = (x) => {
            const v = Ei(r.current).includes(x.animationName);
            if (x.target === t && v && (c("ANIMATION_END"), !o.current)) {
              const w = t.style.animationFillMode;
              ((t.style.animationFillMode = "forwards"),
                (u = d.setTimeout(() => {
                  t.style.animationFillMode === "forwards" &&
                    (t.style.animationFillMode = w);
                })));
            }
          },
          h = (x) => {
            x.target === t && (s.current = Ei(r.current));
          };
        return (
          t.addEventListener("animationstart", h),
          t.addEventListener("animationcancel", p),
          t.addEventListener("animationend", p),
          () => {
            (d.clearTimeout(u),
              t.removeEventListener("animationstart", h),
              t.removeEventListener("animationcancel", p),
              t.removeEventListener("animationend", p));
          }
        );
      } else c("ANIMATION_END");
    }, [t, c]),
    {
      isPresent: ["mounted", "unmountSuspended"].includes(a),
      ref: f.useCallback((u) => {
        (u && (r.current = getComputedStyle(u)), n(u));
      }, []),
    }
  );
}
function Ei(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
function wC(e) {
  var r, o;
  let t =
      (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null
        ? void 0
        : r.get,
    n = t && "isReactWarning" in t && t.isReactWarning;
  return n
    ? e.ref
    : ((t =
        (o = Object.getOwnPropertyDescriptor(e, "ref")) == null
          ? void 0
          : o.get),
      (n = t && "isReactWarning" in t && t.isReactWarning),
      n ? e.props.ref : e.props.ref || e.ref);
}
function Lo({ prop: e, defaultProp: t, onChange: n = () => {} }) {
  const [r, o] = SC({ defaultProp: t, onChange: n }),
    s = e !== void 0,
    i = s ? e : r,
    a = xe(n),
    c = f.useCallback(
      (u) => {
        if (s) {
          const p = typeof u == "function" ? u(e) : u;
          p !== e && a(p);
        } else o(u);
      },
      [s, e, o, a],
    );
  return [i, c];
}
function SC({ defaultProp: e, onChange: t }) {
  const n = f.useState(e),
    [r] = n,
    o = f.useRef(r),
    s = xe(t);
  return (
    f.useEffect(() => {
      o.current !== r && (s(r), (o.current = r));
    }, [r, o, s]),
    n
  );
}
var bC = "VisuallyHidden",
  ti = f.forwardRef((e, t) =>
    l.jsx(H.span, {
      ...e,
      ref: t,
      style: {
        position: "absolute",
        border: 0,
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        wordWrap: "normal",
        ...e.style,
      },
    }),
  );
ti.displayName = bC;
var CC = ti,
  Md = "ToastProvider",
  [Ld, NC, EC] = Id("Toast"),
  [Tv, zP] = en("Toast", [EC]),
  [jC, ea] = Tv(Md),
  Rv = (e) => {
    const {
        __scopeToast: t,
        label: n = "Notification",
        duration: r = 5e3,
        swipeDirection: o = "right",
        swipeThreshold: s = 50,
        children: i,
      } = e,
      [a, c] = f.useState(null),
      [u, d] = f.useState(0),
      p = f.useRef(!1),
      h = f.useRef(!1);
    return (
      n.trim() ||
        console.error(
          `Invalid prop \`label\` supplied to \`${Md}\`. Expected non-empty \`string\`.`,
        ),
      l.jsx(Ld.Provider, {
        scope: t,
        children: l.jsx(jC, {
          scope: t,
          label: n,
          duration: r,
          swipeDirection: o,
          swipeThreshold: s,
          toastCount: u,
          viewport: a,
          onViewportChange: c,
          onToastAdd: f.useCallback(() => d((x) => x + 1), []),
          onToastRemove: f.useCallback(() => d((x) => x - 1), []),
          isFocusedToastEscapeKeyDownRef: p,
          isClosePausedRef: h,
          children: i,
        }),
      })
    );
  };
Rv.displayName = Md;
var Av = "ToastViewport",
  kC = ["F8"],
  mu = "toast.viewportPause",
  gu = "toast.viewportResume",
  _v = f.forwardRef((e, t) => {
    const {
        __scopeToast: n,
        hotkey: r = kC,
        label: o = "Notifications ({hotkey})",
        ...s
      } = e,
      i = ea(Av, n),
      a = NC(n),
      c = f.useRef(null),
      u = f.useRef(null),
      d = f.useRef(null),
      p = f.useRef(null),
      h = te(t, p, i.onViewportChange),
      x = r.join("+").replace(/Key/g, "").replace(/Digit/g, ""),
      S = i.toastCount > 0;
    (f.useEffect(() => {
      const w = (g) => {
        var y;
        r.length !== 0 &&
          r.every((b) => g[b] || g.code === b) &&
          ((y = p.current) == null || y.focus());
      };
      return (
        document.addEventListener("keydown", w),
        () => document.removeEventListener("keydown", w)
      );
    }, [r]),
      f.useEffect(() => {
        const w = c.current,
          g = p.current;
        if (S && w && g) {
          const m = () => {
              if (!i.isClosePausedRef.current) {
                const k = new CustomEvent(mu);
                (g.dispatchEvent(k), (i.isClosePausedRef.current = !0));
              }
            },
            y = () => {
              if (i.isClosePausedRef.current) {
                const k = new CustomEvent(gu);
                (g.dispatchEvent(k), (i.isClosePausedRef.current = !1));
              }
            },
            b = (k) => {
              !w.contains(k.relatedTarget) && y();
            },
            E = () => {
              w.contains(document.activeElement) || y();
            };
          return (
            w.addEventListener("focusin", m),
            w.addEventListener("focusout", b),
            w.addEventListener("pointermove", m),
            w.addEventListener("pointerleave", E),
            window.addEventListener("blur", m),
            window.addEventListener("focus", y),
            () => {
              (w.removeEventListener("focusin", m),
                w.removeEventListener("focusout", b),
                w.removeEventListener("pointermove", m),
                w.removeEventListener("pointerleave", E),
                window.removeEventListener("blur", m),
                window.removeEventListener("focus", y));
            }
          );
        }
      }, [S, i.isClosePausedRef]));
    const v = f.useCallback(
      ({ tabbingDirection: w }) => {
        const m = a().map((y) => {
          const b = y.ref.current,
            E = [b, ...$C(b)];
          return w === "forwards" ? E : E.reverse();
        });
        return (w === "forwards" ? m.reverse() : m).flat();
      },
      [a],
    );
    return (
      f.useEffect(() => {
        const w = p.current;
        if (w) {
          const g = (m) => {
            var E, k, N;
            const y = m.altKey || m.ctrlKey || m.metaKey;
            if (m.key === "Tab" && !y) {
              const j = document.activeElement,
                P = m.shiftKey;
              if (m.target === w && P) {
                (E = u.current) == null || E.focus();
                return;
              }
              const I = v({ tabbingDirection: P ? "backwards" : "forwards" }),
                V = I.findIndex((O) => O === j);
              Qa(I.slice(V + 1))
                ? m.preventDefault()
                : P
                  ? (k = u.current) == null || k.focus()
                  : (N = d.current) == null || N.focus();
            }
          };
          return (
            w.addEventListener("keydown", g),
            () => w.removeEventListener("keydown", g)
          );
        }
      }, [a, v]),
      l.jsxs(gC, {
        ref: c,
        role: "region",
        "aria-label": o.replace("{hotkey}", x),
        tabIndex: -1,
        style: { pointerEvents: S ? void 0 : "none" },
        children: [
          S &&
            l.jsx(vu, {
              ref: u,
              onFocusFromOutsideViewport: () => {
                const w = v({ tabbingDirection: "forwards" });
                Qa(w);
              },
            }),
          l.jsx(Ld.Slot, {
            scope: n,
            children: l.jsx(H.ol, { tabIndex: -1, ...s, ref: h }),
          }),
          S &&
            l.jsx(vu, {
              ref: d,
              onFocusFromOutsideViewport: () => {
                const w = v({ tabbingDirection: "backwards" });
                Qa(w);
              },
            }),
        ],
      })
    );
  });
_v.displayName = Av;
var Ov = "ToastFocusProxy",
  vu = f.forwardRef((e, t) => {
    const { __scopeToast: n, onFocusFromOutsideViewport: r, ...o } = e,
      s = ea(Ov, n);
    return l.jsx(ti, {
      "aria-hidden": !0,
      tabIndex: 0,
      ...o,
      ref: t,
      style: { position: "fixed" },
      onFocus: (i) => {
        var u;
        const a = i.relatedTarget;
        !((u = s.viewport) != null && u.contains(a)) && r();
      },
    });
  });
vu.displayName = Ov;
var ta = "Toast",
  PC = "toast.swipeStart",
  TC = "toast.swipeMove",
  RC = "toast.swipeCancel",
  AC = "toast.swipeEnd",
  Iv = f.forwardRef((e, t) => {
    const { forceMount: n, open: r, defaultOpen: o, onOpenChange: s, ...i } = e,
      [a = !0, c] = Lo({ prop: r, defaultProp: o, onChange: s });
    return l.jsx(Dt, {
      present: n || a,
      children: l.jsx(IC, {
        open: a,
        ...i,
        ref: t,
        onClose: () => c(!1),
        onPause: xe(e.onPause),
        onResume: xe(e.onResume),
        onSwipeStart: $(e.onSwipeStart, (u) => {
          u.currentTarget.setAttribute("data-swipe", "start");
        }),
        onSwipeMove: $(e.onSwipeMove, (u) => {
          const { x: d, y: p } = u.detail.delta;
          (u.currentTarget.setAttribute("data-swipe", "move"),
            u.currentTarget.style.setProperty(
              "--radix-toast-swipe-move-x",
              `${d}px`,
            ),
            u.currentTarget.style.setProperty(
              "--radix-toast-swipe-move-y",
              `${p}px`,
            ));
        }),
        onSwipeCancel: $(e.onSwipeCancel, (u) => {
          (u.currentTarget.setAttribute("data-swipe", "cancel"),
            u.currentTarget.style.removeProperty("--radix-toast-swipe-move-x"),
            u.currentTarget.style.removeProperty("--radix-toast-swipe-move-y"),
            u.currentTarget.style.removeProperty("--radix-toast-swipe-end-x"),
            u.currentTarget.style.removeProperty("--radix-toast-swipe-end-y"));
        }),
        onSwipeEnd: $(e.onSwipeEnd, (u) => {
          const { x: d, y: p } = u.detail.delta;
          (u.currentTarget.setAttribute("data-swipe", "end"),
            u.currentTarget.style.removeProperty("--radix-toast-swipe-move-x"),
            u.currentTarget.style.removeProperty("--radix-toast-swipe-move-y"),
            u.currentTarget.style.setProperty(
              "--radix-toast-swipe-end-x",
              `${d}px`,
            ),
            u.currentTarget.style.setProperty(
              "--radix-toast-swipe-end-y",
              `${p}px`,
            ),
            c(!1));
        }),
      }),
    });
  });
Iv.displayName = ta;
var [_C, OC] = Tv(ta, { onClose() {} }),
  IC = f.forwardRef((e, t) => {
    const {
        __scopeToast: n,
        type: r = "foreground",
        duration: o,
        open: s,
        onClose: i,
        onEscapeKeyDown: a,
        onPause: c,
        onResume: u,
        onSwipeStart: d,
        onSwipeMove: p,
        onSwipeCancel: h,
        onSwipeEnd: x,
        ...S
      } = e,
      v = ea(ta, n),
      [w, g] = f.useState(null),
      m = te(t, (O) => g(O)),
      y = f.useRef(null),
      b = f.useRef(null),
      E = o || v.duration,
      k = f.useRef(0),
      N = f.useRef(E),
      j = f.useRef(0),
      { onToastAdd: P, onToastRemove: R } = v,
      M = xe(() => {
        var K;
        ((w == null ? void 0 : w.contains(document.activeElement)) &&
          ((K = v.viewport) == null || K.focus()),
          i());
      }),
      I = f.useCallback(
        (O) => {
          !O ||
            O === 1 / 0 ||
            (window.clearTimeout(j.current),
            (k.current = new Date().getTime()),
            (j.current = window.setTimeout(M, O)));
        },
        [M],
      );
    (f.useEffect(() => {
      const O = v.viewport;
      if (O) {
        const K = () => {
            (I(N.current), u == null || u());
          },
          F = () => {
            const Q = new Date().getTime() - k.current;
            ((N.current = N.current - Q),
              window.clearTimeout(j.current),
              c == null || c());
          };
        return (
          O.addEventListener(mu, F),
          O.addEventListener(gu, K),
          () => {
            (O.removeEventListener(mu, F), O.removeEventListener(gu, K));
          }
        );
      }
    }, [v.viewport, E, c, u, I]),
      f.useEffect(() => {
        s && !v.isClosePausedRef.current && I(E);
      }, [s, E, v.isClosePausedRef, I]),
      f.useEffect(() => (P(), () => R()), [P, R]));
    const V = f.useMemo(() => (w ? Uv(w) : null), [w]);
    return v.viewport
      ? l.jsxs(l.Fragment, {
          children: [
            V &&
              l.jsx(MC, {
                __scopeToast: n,
                role: "status",
                "aria-live": r === "foreground" ? "assertive" : "polite",
                "aria-atomic": !0,
                children: V,
              }),
            l.jsx(_C, {
              scope: n,
              onClose: M,
              children: zr.createPortal(
                l.jsx(Ld.ItemSlot, {
                  scope: n,
                  children: l.jsx(mC, {
                    asChild: !0,
                    onEscapeKeyDown: $(a, () => {
                      (v.isFocusedToastEscapeKeyDownRef.current || M(),
                        (v.isFocusedToastEscapeKeyDownRef.current = !1));
                    }),
                    children: l.jsx(H.li, {
                      role: "status",
                      "aria-live": "off",
                      "aria-atomic": !0,
                      tabIndex: 0,
                      "data-state": s ? "open" : "closed",
                      "data-swipe-direction": v.swipeDirection,
                      ...S,
                      ref: m,
                      style: {
                        userSelect: "none",
                        touchAction: "none",
                        ...e.style,
                      },
                      onKeyDown: $(e.onKeyDown, (O) => {
                        O.key === "Escape" &&
                          (a == null || a(O.nativeEvent),
                          O.nativeEvent.defaultPrevented ||
                            ((v.isFocusedToastEscapeKeyDownRef.current = !0),
                            M()));
                      }),
                      onPointerDown: $(e.onPointerDown, (O) => {
                        O.button === 0 &&
                          (y.current = { x: O.clientX, y: O.clientY });
                      }),
                      onPointerMove: $(e.onPointerMove, (O) => {
                        if (!y.current) return;
                        const K = O.clientX - y.current.x,
                          F = O.clientY - y.current.y,
                          Q = !!b.current,
                          T = ["left", "right"].includes(v.swipeDirection),
                          _ = ["left", "up"].includes(v.swipeDirection)
                            ? Math.min
                            : Math.max,
                          z = T ? _(0, K) : 0,
                          W = T ? 0 : _(0, F),
                          oe = O.pointerType === "touch" ? 10 : 2,
                          Be = { x: z, y: W },
                          Ne = { originalEvent: O, delta: Be };
                        Q
                          ? ((b.current = Be), ji(TC, p, Ne, { discrete: !1 }))
                          : Kp(Be, v.swipeDirection, oe)
                            ? ((b.current = Be),
                              ji(PC, d, Ne, { discrete: !1 }),
                              O.target.setPointerCapture(O.pointerId))
                            : (Math.abs(K) > oe || Math.abs(F) > oe) &&
                              (y.current = null);
                      }),
                      onPointerUp: $(e.onPointerUp, (O) => {
                        const K = b.current,
                          F = O.target;
                        if (
                          (F.hasPointerCapture(O.pointerId) &&
                            F.releasePointerCapture(O.pointerId),
                          (b.current = null),
                          (y.current = null),
                          K)
                        ) {
                          const Q = O.currentTarget,
                            T = { originalEvent: O, delta: K };
                          (Kp(K, v.swipeDirection, v.swipeThreshold)
                            ? ji(AC, x, T, { discrete: !0 })
                            : ji(RC, h, T, { discrete: !0 }),
                            Q.addEventListener(
                              "click",
                              (_) => _.preventDefault(),
                              { once: !0 },
                            ));
                        }
                      }),
                    }),
                  }),
                }),
                v.viewport,
              ),
            }),
          ],
        })
      : null;
  }),
  MC = (e) => {
    const { __scopeToast: t, children: n, ...r } = e,
      o = ea(ta, t),
      [s, i] = f.useState(!1),
      [a, c] = f.useState(!1);
    return (
      FC(() => i(!0)),
      f.useEffect(() => {
        const u = window.setTimeout(() => c(!0), 1e3);
        return () => window.clearTimeout(u);
      }, []),
      a
        ? null
        : l.jsx(Jl, {
            asChild: !0,
            children: l.jsx(ti, {
              ...r,
              children:
                s && l.jsxs(l.Fragment, { children: [o.label, " ", n] }),
            }),
          })
    );
  },
  LC = "ToastTitle",
  Mv = f.forwardRef((e, t) => {
    const { __scopeToast: n, ...r } = e;
    return l.jsx(H.div, { ...r, ref: t });
  });
Mv.displayName = LC;
var DC = "ToastDescription",
  Lv = f.forwardRef((e, t) => {
    const { __scopeToast: n, ...r } = e;
    return l.jsx(H.div, { ...r, ref: t });
  });
Lv.displayName = DC;
var Dv = "ToastAction",
  Fv = f.forwardRef((e, t) => {
    const { altText: n, ...r } = e;
    return n.trim()
      ? l.jsx($v, {
          altText: n,
          asChild: !0,
          children: l.jsx(Dd, { ...r, ref: t }),
        })
      : (console.error(
          `Invalid prop \`altText\` supplied to \`${Dv}\`. Expected non-empty \`string\`.`,
        ),
        null);
  });
Fv.displayName = Dv;
var zv = "ToastClose",
  Dd = f.forwardRef((e, t) => {
    const { __scopeToast: n, ...r } = e,
      o = OC(zv, n);
    return l.jsx($v, {
      asChild: !0,
      children: l.jsx(H.button, {
        type: "button",
        ...r,
        ref: t,
        onClick: $(e.onClick, o.onClose),
      }),
    });
  });
Dd.displayName = zv;
var $v = f.forwardRef((e, t) => {
  const { __scopeToast: n, altText: r, ...o } = e;
  return l.jsx(H.div, {
    "data-radix-toast-announce-exclude": "",
    "data-radix-toast-announce-alt": r || void 0,
    ...o,
    ref: t,
  });
});
function Uv(e) {
  const t = [];
  return (
    Array.from(e.childNodes).forEach((r) => {
      if (
        (r.nodeType === r.TEXT_NODE && r.textContent && t.push(r.textContent),
        zC(r))
      ) {
        const o = r.ariaHidden || r.hidden || r.style.display === "none",
          s = r.dataset.radixToastAnnounceExclude === "";
        if (!o)
          if (s) {
            const i = r.dataset.radixToastAnnounceAlt;
            i && t.push(i);
          } else t.push(...Uv(r));
      }
    }),
    t
  );
}
function ji(e, t, n, { discrete: r }) {
  const o = n.originalEvent.currentTarget,
    s = new CustomEvent(e, { bubbles: !0, cancelable: !0, detail: n });
  (t && o.addEventListener(e, t, { once: !0 }),
    r ? Ev(o, s) : o.dispatchEvent(s));
}
var Kp = (e, t, n = 0) => {
  const r = Math.abs(e.x),
    o = Math.abs(e.y),
    s = r > o;
  return t === "left" || t === "right" ? s && r > n : !s && o > n;
};
function FC(e = () => {}) {
  const t = xe(e);
  Ce(() => {
    let n = 0,
      r = 0;
    return (
      (n = window.requestAnimationFrame(
        () => (r = window.requestAnimationFrame(t)),
      )),
      () => {
        (window.cancelAnimationFrame(n), window.cancelAnimationFrame(r));
      }
    );
  }, [t]);
}
function zC(e) {
  return e.nodeType === e.ELEMENT_NODE;
}
function $C(e) {
  const t = [],
    n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (r) => {
        const o = r.tagName === "INPUT" && r.type === "hidden";
        return r.disabled || r.hidden || o
          ? NodeFilter.FILTER_SKIP
          : r.tabIndex >= 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
      },
    });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function Qa(e) {
  const t = document.activeElement;
  return e.some((n) =>
    n === t ? !0 : (n.focus(), document.activeElement !== t),
  );
}
var UC = Rv,
  Bv = _v,
  Hv = Iv,
  Vv = Mv,
  Wv = Lv,
  Kv = Fv,
  Qv = Dd;
function Gv(e) {
  var t,
    n,
    r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object")
    if (Array.isArray(e)) {
      var o = e.length;
      for (t = 0; t < o; t++)
        e[t] && (n = Gv(e[t])) && (r && (r += " "), (r += n));
    } else for (n in e) e[n] && (r && (r += " "), (r += n));
  return r;
}
function Yv() {
  for (var e, t, n = 0, r = "", o = arguments.length; n < o; n++)
    (e = arguments[n]) && (t = Gv(e)) && (r && (r += " "), (r += t));
  return r;
}
const Qp = (e) => (typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e),
  Gp = Yv,
  Fd = (e, t) => (n) => {
    var r;
    if ((t == null ? void 0 : t.variants) == null)
      return Gp(
        e,
        n == null ? void 0 : n.class,
        n == null ? void 0 : n.className,
      );
    const { variants: o, defaultVariants: s } = t,
      i = Object.keys(o).map((u) => {
        const d = n == null ? void 0 : n[u],
          p = s == null ? void 0 : s[u];
        if (d === null) return null;
        const h = Qp(d) || Qp(p);
        return o[u][h];
      }),
      a =
        n &&
        Object.entries(n).reduce((u, d) => {
          let [p, h] = d;
          return (h === void 0 || (u[p] = h), u);
        }, {}),
      c =
        t == null || (r = t.compoundVariants) === null || r === void 0
          ? void 0
          : r.reduce((u, d) => {
              let { class: p, className: h, ...x } = d;
              return Object.entries(x).every((S) => {
                let [v, w] = S;
                return Array.isArray(w)
                  ? w.includes({ ...s, ...a }[v])
                  : { ...s, ...a }[v] === w;
              })
                ? [...u, p, h]
                : u;
            }, []);
    return Gp(
      e,
      i,
      c,
      n == null ? void 0 : n.class,
      n == null ? void 0 : n.className,
    );
  };
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const BC = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  qv = (...e) => e.filter((t, n, r) => !!t && r.indexOf(t) === n).join(" ");
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var HC = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const VC = f.forwardRef(
  (
    {
      color: e = "currentColor",
      size: t = 24,
      strokeWidth: n = 2,
      absoluteStrokeWidth: r,
      className: o = "",
      children: s,
      iconNode: i,
      ...a
    },
    c,
  ) =>
    f.createElement(
      "svg",
      {
        ref: c,
        ...HC,
        width: t,
        height: t,
        stroke: e,
        strokeWidth: r ? (Number(n) * 24) / Number(t) : n,
        className: qv("lucide", o),
        ...a,
      },
      [
        ...i.map(([u, d]) => f.createElement(u, d)),
        ...(Array.isArray(s) ? s : [s]),
      ],
    ),
);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Z = (e, t) => {
  const n = f.forwardRef(({ className: r, ...o }, s) =>
    f.createElement(VC, {
      ref: s,
      iconNode: t,
      className: qv(`lucide-${BC(e)}`, r),
      ...o,
    }),
  );
  return ((n.displayName = `${e}`), n);
};
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const yu = Z("ArrowRight", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const WC = Z("Award", [
  [
    "path",
    {
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv",
    },
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Bs = Z("BookOpen", [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y",
    },
  ],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const KC = Z("BookmarkCheck", [
  [
    "path",
    { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z", key: "169p4p" },
  ],
  ["path", { d: "m9 10 2 2 4-4", key: "1gnqz4" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const zd = Z("Bookmark", [
  [
    "path",
    { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z", key: "1fy3hk" },
  ],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Yp = Z("Bot", [
  ["path", { d: "M12 8V4H8", key: "hb8ula" }],
  [
    "rect",
    { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" },
  ],
  ["path", { d: "M2 14h2", key: "vft8re" }],
  ["path", { d: "M20 14h2", key: "4cs60a" }],
  ["path", { d: "M15 13v2", key: "1xurst" }],
  ["path", { d: "M9 13v2", key: "rq6x2g" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Xv = Z("Briefcase", [
  ["path", { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", key: "jecpp" }],
  [
    "rect",
    { width: "20", height: "14", x: "2", y: "6", rx: "2", key: "i6l2r4" },
  ],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const yn = Z("Calendar", [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  [
    "rect",
    { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" },
  ],
  ["path", { d: "M3 10h18", key: "8toen8" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const $d = Z("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Zv = Z("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const QC = Z("ChevronUp", [
  ["path", { d: "m18 15-6-6-6 6", key: "153udz" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const GC = Z("CircleAlert", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const YC = Z("CircleCheckBig", [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Jv = Z("Clock", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const qC = Z("Code", [
  ["polyline", { points: "16 18 22 12 16 6", key: "z7tu5w" }],
  ["polyline", { points: "8 6 2 12 8 18", key: "1eg1df" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ey = Z("ExternalLink", [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  [
    "path",
    {
      d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
      key: "a6xqqp",
    },
  ],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const XC = Z("Globe", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  [
    "path",
    { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" },
  ],
  ["path", { d: "M2 12h20", key: "9i4pu4" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Xt = Z("GraduationCap", [
  [
    "path",
    {
      d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",
      key: "j76jl0",
    },
  ],
  ["path", { d: "M22 10v6", key: "1lu8f3" }],
  ["path", { d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5", key: "1r8lef" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const qp = Z("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ty = Z("MessageCircle", [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ZC = Z("Minus", [["path", { d: "M5 12h14", key: "1ays0h" }]]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const JC = Z("Moon", [
  ["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z", key: "a7tn18" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const eN = Z("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ny = Z("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const tN = Z("Send", [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3",
    },
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const nN = Z("SlidersHorizontal", [
  ["line", { x1: "21", x2: "14", y1: "4", y2: "4", key: "obuewd" }],
  ["line", { x1: "10", x2: "3", y1: "4", y2: "4", key: "1q6298" }],
  ["line", { x1: "21", x2: "12", y1: "12", y2: "12", key: "1iu8h1" }],
  ["line", { x1: "8", x2: "3", y1: "12", y2: "12", key: "ntss68" }],
  ["line", { x1: "21", x2: "16", y1: "20", y2: "20", key: "14d8ph" }],
  ["line", { x1: "12", x2: "3", y1: "20", y2: "20", key: "m0wm8r" }],
  ["line", { x1: "14", x2: "14", y1: "2", y2: "6", key: "14e1ph" }],
  ["line", { x1: "8", x2: "8", y1: "10", y2: "14", key: "1i6ji0" }],
  ["line", { x1: "16", x2: "16", y1: "18", y2: "22", key: "1lctlv" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Cl = Z("Sparkles", [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx",
    },
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ry = Z("Star", [
  [
    "polygon",
    {
      points:
        "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",
      key: "8f66p6",
    },
  ],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const rN = Z("Sun", [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Xp = Z("Target", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const oN = Z("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const oy = Z("TrendingUp", [
  ["polyline", { points: "22 7 13.5 15.5 8.5 10.5 2 17", key: "126l90" }],
  ["polyline", { points: "16 7 22 7 22 13", key: "kwv8wd" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const sN = Z("User", [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Or = Z("Users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75", key: "1da9ce" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ga = Z("Video", [
  [
    "path",
    {
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "ftymec",
    },
  ],
  [
    "rect",
    { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" },
  ],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ni = Z("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
]);
/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const iN = Z("Youtube", [
    [
      "path",
      {
        d: "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",
        key: "1q2vi4",
      },
    ],
    ["path", { d: "m10 15 5-3-5-3z", key: "1jp15x" }],
  ]),
  Ud = "-",
  lN = (e) => {
    const t = cN(e),
      { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
    return {
      getClassGroupId: (i) => {
        const a = i.split(Ud);
        return (a[0] === "" && a.length !== 1 && a.shift(), sy(a, t) || aN(i));
      },
      getConflictingClassGroupIds: (i, a) => {
        const c = n[i] || [];
        return a && r[i] ? [...c, ...r[i]] : c;
      },
    };
  },
  sy = (e, t) => {
    var i;
    if (e.length === 0) return t.classGroupId;
    const n = e[0],
      r = t.nextPart.get(n),
      o = r ? sy(e.slice(1), r) : void 0;
    if (o) return o;
    if (t.validators.length === 0) return;
    const s = e.join(Ud);
    return (i = t.validators.find(({ validator: a }) => a(s))) == null
      ? void 0
      : i.classGroupId;
  },
  Zp = /^\[(.+)\]$/,
  aN = (e) => {
    if (Zp.test(e)) {
      const t = Zp.exec(e)[1],
        n = t == null ? void 0 : t.substring(0, t.indexOf(":"));
      if (n) return "arbitrary.." + n;
    }
  },
  cN = (e) => {
    const { theme: t, prefix: n } = e,
      r = { nextPart: new Map(), validators: [] };
    return (
      dN(Object.entries(e.classGroups), n).forEach(([s, i]) => {
        xu(i, r, s, t);
      }),
      r
    );
  },
  xu = (e, t, n, r) => {
    e.forEach((o) => {
      if (typeof o == "string") {
        const s = o === "" ? t : Jp(t, o);
        s.classGroupId = n;
        return;
      }
      if (typeof o == "function") {
        if (uN(o)) {
          xu(o(r), t, n, r);
          return;
        }
        t.validators.push({ validator: o, classGroupId: n });
        return;
      }
      Object.entries(o).forEach(([s, i]) => {
        xu(i, Jp(t, s), n, r);
      });
    });
  },
  Jp = (e, t) => {
    let n = e;
    return (
      t.split(Ud).forEach((r) => {
        (n.nextPart.has(r) ||
          n.nextPart.set(r, { nextPart: new Map(), validators: [] }),
          (n = n.nextPart.get(r)));
      }),
      n
    );
  },
  uN = (e) => e.isThemeGetter,
  dN = (e, t) =>
    t
      ? e.map(([n, r]) => {
          const o = r.map((s) =>
            typeof s == "string"
              ? t + s
              : typeof s == "object"
                ? Object.fromEntries(
                    Object.entries(s).map(([i, a]) => [t + i, a]),
                  )
                : s,
          );
          return [n, o];
        })
      : e,
  fN = (e) => {
    if (e < 1) return { get: () => {}, set: () => {} };
    let t = 0,
      n = new Map(),
      r = new Map();
    const o = (s, i) => {
      (n.set(s, i), t++, t > e && ((t = 0), (r = n), (n = new Map())));
    };
    return {
      get(s) {
        let i = n.get(s);
        if (i !== void 0) return i;
        if ((i = r.get(s)) !== void 0) return (o(s, i), i);
      },
      set(s, i) {
        n.has(s) ? n.set(s, i) : o(s, i);
      },
    };
  },
  iy = "!",
  pN = (e) => {
    const { separator: t, experimentalParseClassName: n } = e,
      r = t.length === 1,
      o = t[0],
      s = t.length,
      i = (a) => {
        const c = [];
        let u = 0,
          d = 0,
          p;
        for (let w = 0; w < a.length; w++) {
          let g = a[w];
          if (u === 0) {
            if (g === o && (r || a.slice(w, w + s) === t)) {
              (c.push(a.slice(d, w)), (d = w + s));
              continue;
            }
            if (g === "/") {
              p = w;
              continue;
            }
          }
          g === "[" ? u++ : g === "]" && u--;
        }
        const h = c.length === 0 ? a : a.substring(d),
          x = h.startsWith(iy),
          S = x ? h.substring(1) : h,
          v = p && p > d ? p - d : void 0;
        return {
          modifiers: c,
          hasImportantModifier: x,
          baseClassName: S,
          maybePostfixModifierPosition: v,
        };
      };
    return n ? (a) => n({ className: a, parseClassName: i }) : i;
  },
  hN = (e) => {
    if (e.length <= 1) return e;
    const t = [];
    let n = [];
    return (
      e.forEach((r) => {
        r[0] === "[" ? (t.push(...n.sort(), r), (n = [])) : n.push(r);
      }),
      t.push(...n.sort()),
      t
    );
  },
  mN = (e) => ({ cache: fN(e.cacheSize), parseClassName: pN(e), ...lN(e) }),
  gN = /\s+/,
  vN = (e, t) => {
    const {
        parseClassName: n,
        getClassGroupId: r,
        getConflictingClassGroupIds: o,
      } = t,
      s = [],
      i = e.trim().split(gN);
    let a = "";
    for (let c = i.length - 1; c >= 0; c -= 1) {
      const u = i[c],
        {
          modifiers: d,
          hasImportantModifier: p,
          baseClassName: h,
          maybePostfixModifierPosition: x,
        } = n(u);
      let S = !!x,
        v = r(S ? h.substring(0, x) : h);
      if (!v) {
        if (!S) {
          a = u + (a.length > 0 ? " " + a : a);
          continue;
        }
        if (((v = r(h)), !v)) {
          a = u + (a.length > 0 ? " " + a : a);
          continue;
        }
        S = !1;
      }
      const w = hN(d).join(":"),
        g = p ? w + iy : w,
        m = g + v;
      if (s.includes(m)) continue;
      s.push(m);
      const y = o(v, S);
      for (let b = 0; b < y.length; ++b) {
        const E = y[b];
        s.push(g + E);
      }
      a = u + (a.length > 0 ? " " + a : a);
    }
    return a;
  };
function yN() {
  let e = 0,
    t,
    n,
    r = "";
  for (; e < arguments.length; )
    (t = arguments[e++]) && (n = ly(t)) && (r && (r += " "), (r += n));
  return r;
}
const ly = (e) => {
  if (typeof e == "string") return e;
  let t,
    n = "";
  for (let r = 0; r < e.length; r++)
    e[r] && (t = ly(e[r])) && (n && (n += " "), (n += t));
  return n;
};
function xN(e, ...t) {
  let n,
    r,
    o,
    s = i;
  function i(c) {
    const u = t.reduce((d, p) => p(d), e());
    return ((n = mN(u)), (r = n.cache.get), (o = n.cache.set), (s = a), a(c));
  }
  function a(c) {
    const u = r(c);
    if (u) return u;
    const d = vN(c, n);
    return (o(c, d), d);
  }
  return function () {
    return s(yN.apply(null, arguments));
  };
}
const ue = (e) => {
    const t = (n) => n[e] || [];
    return ((t.isThemeGetter = !0), t);
  },
  ay = /^\[(?:([a-z-]+):)?(.+)\]$/i,
  wN = /^\d+\/\d+$/,
  SN = new Set(["px", "full", "screen"]),
  bN = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  CN =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  NN = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/,
  EN = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  jN =
    /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  rn = (e) => co(e) || SN.has(e) || wN.test(e),
  Nn = (e) => Wo(e, "length", IN),
  co = (e) => !!e && !Number.isNaN(Number(e)),
  Ya = (e) => Wo(e, "number", co),
  is = (e) => !!e && Number.isInteger(Number(e)),
  kN = (e) => e.endsWith("%") && co(e.slice(0, -1)),
  G = (e) => ay.test(e),
  En = (e) => bN.test(e),
  PN = new Set(["length", "size", "percentage"]),
  TN = (e) => Wo(e, PN, cy),
  RN = (e) => Wo(e, "position", cy),
  AN = new Set(["image", "url"]),
  _N = (e) => Wo(e, AN, LN),
  ON = (e) => Wo(e, "", MN),
  ls = () => !0,
  Wo = (e, t, n) => {
    const r = ay.exec(e);
    return r
      ? r[1]
        ? typeof t == "string"
          ? r[1] === t
          : t.has(r[1])
        : n(r[2])
      : !1;
  },
  IN = (e) => CN.test(e) && !NN.test(e),
  cy = () => !1,
  MN = (e) => EN.test(e),
  LN = (e) => jN.test(e),
  DN = () => {
    const e = ue("colors"),
      t = ue("spacing"),
      n = ue("blur"),
      r = ue("brightness"),
      o = ue("borderColor"),
      s = ue("borderRadius"),
      i = ue("borderSpacing"),
      a = ue("borderWidth"),
      c = ue("contrast"),
      u = ue("grayscale"),
      d = ue("hueRotate"),
      p = ue("invert"),
      h = ue("gap"),
      x = ue("gradientColorStops"),
      S = ue("gradientColorStopPositions"),
      v = ue("inset"),
      w = ue("margin"),
      g = ue("opacity"),
      m = ue("padding"),
      y = ue("saturate"),
      b = ue("scale"),
      E = ue("sepia"),
      k = ue("skew"),
      N = ue("space"),
      j = ue("translate"),
      P = () => ["auto", "contain", "none"],
      R = () => ["auto", "hidden", "clip", "visible", "scroll"],
      M = () => ["auto", G, t],
      I = () => [G, t],
      V = () => ["", rn, Nn],
      O = () => ["auto", co, G],
      K = () => [
        "bottom",
        "center",
        "left",
        "left-bottom",
        "left-top",
        "right",
        "right-bottom",
        "right-top",
        "top",
      ],
      F = () => ["solid", "dashed", "dotted", "double", "none"],
      Q = () => [
        "normal",
        "multiply",
        "screen",
        "overlay",
        "darken",
        "lighten",
        "color-dodge",
        "color-burn",
        "hard-light",
        "soft-light",
        "difference",
        "exclusion",
        "hue",
        "saturation",
        "color",
        "luminosity",
      ],
      T = () => [
        "start",
        "end",
        "center",
        "between",
        "around",
        "evenly",
        "stretch",
      ],
      _ = () => ["", "0", G],
      z = () => [
        "auto",
        "avoid",
        "all",
        "avoid-page",
        "page",
        "left",
        "right",
        "column",
      ],
      W = () => [co, G];
    return {
      cacheSize: 500,
      separator: ":",
      theme: {
        colors: [ls],
        spacing: [rn, Nn],
        blur: ["none", "", En, G],
        brightness: W(),
        borderColor: [e],
        borderRadius: ["none", "", "full", En, G],
        borderSpacing: I(),
        borderWidth: V(),
        contrast: W(),
        grayscale: _(),
        hueRotate: W(),
        invert: _(),
        gap: I(),
        gradientColorStops: [e],
        gradientColorStopPositions: [kN, Nn],
        inset: M(),
        margin: M(),
        opacity: W(),
        padding: I(),
        saturate: W(),
        scale: W(),
        sepia: _(),
        skew: W(),
        space: I(),
        translate: I(),
      },
      classGroups: {
        aspect: [{ aspect: ["auto", "square", "video", G] }],
        container: ["container"],
        columns: [{ columns: [En] }],
        "break-after": [{ "break-after": z() }],
        "break-before": [{ "break-before": z() }],
        "break-inside": [
          { "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"] },
        ],
        "box-decoration": [{ "box-decoration": ["slice", "clone"] }],
        box: [{ box: ["border", "content"] }],
        display: [
          "block",
          "inline-block",
          "inline",
          "flex",
          "inline-flex",
          "table",
          "inline-table",
          "table-caption",
          "table-cell",
          "table-column",
          "table-column-group",
          "table-footer-group",
          "table-header-group",
          "table-row-group",
          "table-row",
          "flow-root",
          "grid",
          "inline-grid",
          "contents",
          "list-item",
          "hidden",
        ],
        float: [{ float: ["right", "left", "none", "start", "end"] }],
        clear: [{ clear: ["left", "right", "both", "none", "start", "end"] }],
        isolation: ["isolate", "isolation-auto"],
        "object-fit": [
          { object: ["contain", "cover", "fill", "none", "scale-down"] },
        ],
        "object-position": [{ object: [...K(), G] }],
        overflow: [{ overflow: R() }],
        "overflow-x": [{ "overflow-x": R() }],
        "overflow-y": [{ "overflow-y": R() }],
        overscroll: [{ overscroll: P() }],
        "overscroll-x": [{ "overscroll-x": P() }],
        "overscroll-y": [{ "overscroll-y": P() }],
        position: ["static", "fixed", "absolute", "relative", "sticky"],
        inset: [{ inset: [v] }],
        "inset-x": [{ "inset-x": [v] }],
        "inset-y": [{ "inset-y": [v] }],
        start: [{ start: [v] }],
        end: [{ end: [v] }],
        top: [{ top: [v] }],
        right: [{ right: [v] }],
        bottom: [{ bottom: [v] }],
        left: [{ left: [v] }],
        visibility: ["visible", "invisible", "collapse"],
        z: [{ z: ["auto", is, G] }],
        basis: [{ basis: M() }],
        "flex-direction": [
          { flex: ["row", "row-reverse", "col", "col-reverse"] },
        ],
        "flex-wrap": [{ flex: ["wrap", "wrap-reverse", "nowrap"] }],
        flex: [{ flex: ["1", "auto", "initial", "none", G] }],
        grow: [{ grow: _() }],
        shrink: [{ shrink: _() }],
        order: [{ order: ["first", "last", "none", is, G] }],
        "grid-cols": [{ "grid-cols": [ls] }],
        "col-start-end": [{ col: ["auto", { span: ["full", is, G] }, G] }],
        "col-start": [{ "col-start": O() }],
        "col-end": [{ "col-end": O() }],
        "grid-rows": [{ "grid-rows": [ls] }],
        "row-start-end": [{ row: ["auto", { span: [is, G] }, G] }],
        "row-start": [{ "row-start": O() }],
        "row-end": [{ "row-end": O() }],
        "grid-flow": [
          { "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"] },
        ],
        "auto-cols": [{ "auto-cols": ["auto", "min", "max", "fr", G] }],
        "auto-rows": [{ "auto-rows": ["auto", "min", "max", "fr", G] }],
        gap: [{ gap: [h] }],
        "gap-x": [{ "gap-x": [h] }],
        "gap-y": [{ "gap-y": [h] }],
        "justify-content": [{ justify: ["normal", ...T()] }],
        "justify-items": [
          { "justify-items": ["start", "end", "center", "stretch"] },
        ],
        "justify-self": [
          { "justify-self": ["auto", "start", "end", "center", "stretch"] },
        ],
        "align-content": [{ content: ["normal", ...T(), "baseline"] }],
        "align-items": [
          { items: ["start", "end", "center", "baseline", "stretch"] },
        ],
        "align-self": [
          { self: ["auto", "start", "end", "center", "stretch", "baseline"] },
        ],
        "place-content": [{ "place-content": [...T(), "baseline"] }],
        "place-items": [
          { "place-items": ["start", "end", "center", "baseline", "stretch"] },
        ],
        "place-self": [
          { "place-self": ["auto", "start", "end", "center", "stretch"] },
        ],
        p: [{ p: [m] }],
        px: [{ px: [m] }],
        py: [{ py: [m] }],
        ps: [{ ps: [m] }],
        pe: [{ pe: [m] }],
        pt: [{ pt: [m] }],
        pr: [{ pr: [m] }],
        pb: [{ pb: [m] }],
        pl: [{ pl: [m] }],
        m: [{ m: [w] }],
        mx: [{ mx: [w] }],
        my: [{ my: [w] }],
        ms: [{ ms: [w] }],
        me: [{ me: [w] }],
        mt: [{ mt: [w] }],
        mr: [{ mr: [w] }],
        mb: [{ mb: [w] }],
        ml: [{ ml: [w] }],
        "space-x": [{ "space-x": [N] }],
        "space-x-reverse": ["space-x-reverse"],
        "space-y": [{ "space-y": [N] }],
        "space-y-reverse": ["space-y-reverse"],
        w: [{ w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", G, t] }],
        "min-w": [{ "min-w": [G, t, "min", "max", "fit"] }],
        "max-w": [
          {
            "max-w": [
              G,
              t,
              "none",
              "full",
              "min",
              "max",
              "fit",
              "prose",
              { screen: [En] },
              En,
            ],
          },
        ],
        h: [{ h: [G, t, "auto", "min", "max", "fit", "svh", "lvh", "dvh"] }],
        "min-h": [
          { "min-h": [G, t, "min", "max", "fit", "svh", "lvh", "dvh"] },
        ],
        "max-h": [
          { "max-h": [G, t, "min", "max", "fit", "svh", "lvh", "dvh"] },
        ],
        size: [{ size: [G, t, "auto", "min", "max", "fit"] }],
        "font-size": [{ text: ["base", En, Nn] }],
        "font-smoothing": ["antialiased", "subpixel-antialiased"],
        "font-style": ["italic", "not-italic"],
        "font-weight": [
          {
            font: [
              "thin",
              "extralight",
              "light",
              "normal",
              "medium",
              "semibold",
              "bold",
              "extrabold",
              "black",
              Ya,
            ],
          },
        ],
        "font-family": [{ font: [ls] }],
        "fvn-normal": ["normal-nums"],
        "fvn-ordinal": ["ordinal"],
        "fvn-slashed-zero": ["slashed-zero"],
        "fvn-figure": ["lining-nums", "oldstyle-nums"],
        "fvn-spacing": ["proportional-nums", "tabular-nums"],
        "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
        tracking: [
          {
            tracking: [
              "tighter",
              "tight",
              "normal",
              "wide",
              "wider",
              "widest",
              G,
            ],
          },
        ],
        "line-clamp": [{ "line-clamp": ["none", co, Ya] }],
        leading: [
          {
            leading: [
              "none",
              "tight",
              "snug",
              "normal",
              "relaxed",
              "loose",
              rn,
              G,
            ],
          },
        ],
        "list-image": [{ "list-image": ["none", G] }],
        "list-style-type": [{ list: ["none", "disc", "decimal", G] }],
        "list-style-position": [{ list: ["inside", "outside"] }],
        "placeholder-color": [{ placeholder: [e] }],
        "placeholder-opacity": [{ "placeholder-opacity": [g] }],
        "text-alignment": [
          { text: ["left", "center", "right", "justify", "start", "end"] },
        ],
        "text-color": [{ text: [e] }],
        "text-opacity": [{ "text-opacity": [g] }],
        "text-decoration": [
          "underline",
          "overline",
          "line-through",
          "no-underline",
        ],
        "text-decoration-style": [{ decoration: [...F(), "wavy"] }],
        "text-decoration-thickness": [
          { decoration: ["auto", "from-font", rn, Nn] },
        ],
        "underline-offset": [{ "underline-offset": ["auto", rn, G] }],
        "text-decoration-color": [{ decoration: [e] }],
        "text-transform": [
          "uppercase",
          "lowercase",
          "capitalize",
          "normal-case",
        ],
        "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
        "text-wrap": [{ text: ["wrap", "nowrap", "balance", "pretty"] }],
        indent: [{ indent: I() }],
        "vertical-align": [
          {
            align: [
              "baseline",
              "top",
              "middle",
              "bottom",
              "text-top",
              "text-bottom",
              "sub",
              "super",
              G,
            ],
          },
        ],
        whitespace: [
          {
            whitespace: [
              "normal",
              "nowrap",
              "pre",
              "pre-line",
              "pre-wrap",
              "break-spaces",
            ],
          },
        ],
        break: [{ break: ["normal", "words", "all", "keep"] }],
        hyphens: [{ hyphens: ["none", "manual", "auto"] }],
        content: [{ content: ["none", G] }],
        "bg-attachment": [{ bg: ["fixed", "local", "scroll"] }],
        "bg-clip": [{ "bg-clip": ["border", "padding", "content", "text"] }],
        "bg-opacity": [{ "bg-opacity": [g] }],
        "bg-origin": [{ "bg-origin": ["border", "padding", "content"] }],
        "bg-position": [{ bg: [...K(), RN] }],
        "bg-repeat": [
          { bg: ["no-repeat", { repeat: ["", "x", "y", "round", "space"] }] },
        ],
        "bg-size": [{ bg: ["auto", "cover", "contain", TN] }],
        "bg-image": [
          {
            bg: [
              "none",
              { "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"] },
              _N,
            ],
          },
        ],
        "bg-color": [{ bg: [e] }],
        "gradient-from-pos": [{ from: [S] }],
        "gradient-via-pos": [{ via: [S] }],
        "gradient-to-pos": [{ to: [S] }],
        "gradient-from": [{ from: [x] }],
        "gradient-via": [{ via: [x] }],
        "gradient-to": [{ to: [x] }],
        rounded: [{ rounded: [s] }],
        "rounded-s": [{ "rounded-s": [s] }],
        "rounded-e": [{ "rounded-e": [s] }],
        "rounded-t": [{ "rounded-t": [s] }],
        "rounded-r": [{ "rounded-r": [s] }],
        "rounded-b": [{ "rounded-b": [s] }],
        "rounded-l": [{ "rounded-l": [s] }],
        "rounded-ss": [{ "rounded-ss": [s] }],
        "rounded-se": [{ "rounded-se": [s] }],
        "rounded-ee": [{ "rounded-ee": [s] }],
        "rounded-es": [{ "rounded-es": [s] }],
        "rounded-tl": [{ "rounded-tl": [s] }],
        "rounded-tr": [{ "rounded-tr": [s] }],
        "rounded-br": [{ "rounded-br": [s] }],
        "rounded-bl": [{ "rounded-bl": [s] }],
        "border-w": [{ border: [a] }],
        "border-w-x": [{ "border-x": [a] }],
        "border-w-y": [{ "border-y": [a] }],
        "border-w-s": [{ "border-s": [a] }],
        "border-w-e": [{ "border-e": [a] }],
        "border-w-t": [{ "border-t": [a] }],
        "border-w-r": [{ "border-r": [a] }],
        "border-w-b": [{ "border-b": [a] }],
        "border-w-l": [{ "border-l": [a] }],
        "border-opacity": [{ "border-opacity": [g] }],
        "border-style": [{ border: [...F(), "hidden"] }],
        "divide-x": [{ "divide-x": [a] }],
        "divide-x-reverse": ["divide-x-reverse"],
        "divide-y": [{ "divide-y": [a] }],
        "divide-y-reverse": ["divide-y-reverse"],
        "divide-opacity": [{ "divide-opacity": [g] }],
        "divide-style": [{ divide: F() }],
        "border-color": [{ border: [o] }],
        "border-color-x": [{ "border-x": [o] }],
        "border-color-y": [{ "border-y": [o] }],
        "border-color-s": [{ "border-s": [o] }],
        "border-color-e": [{ "border-e": [o] }],
        "border-color-t": [{ "border-t": [o] }],
        "border-color-r": [{ "border-r": [o] }],
        "border-color-b": [{ "border-b": [o] }],
        "border-color-l": [{ "border-l": [o] }],
        "divide-color": [{ divide: [o] }],
        "outline-style": [{ outline: ["", ...F()] }],
        "outline-offset": [{ "outline-offset": [rn, G] }],
        "outline-w": [{ outline: [rn, Nn] }],
        "outline-color": [{ outline: [e] }],
        "ring-w": [{ ring: V() }],
        "ring-w-inset": ["ring-inset"],
        "ring-color": [{ ring: [e] }],
        "ring-opacity": [{ "ring-opacity": [g] }],
        "ring-offset-w": [{ "ring-offset": [rn, Nn] }],
        "ring-offset-color": [{ "ring-offset": [e] }],
        shadow: [{ shadow: ["", "inner", "none", En, ON] }],
        "shadow-color": [{ shadow: [ls] }],
        opacity: [{ opacity: [g] }],
        "mix-blend": [{ "mix-blend": [...Q(), "plus-lighter", "plus-darker"] }],
        "bg-blend": [{ "bg-blend": Q() }],
        filter: [{ filter: ["", "none"] }],
        blur: [{ blur: [n] }],
        brightness: [{ brightness: [r] }],
        contrast: [{ contrast: [c] }],
        "drop-shadow": [{ "drop-shadow": ["", "none", En, G] }],
        grayscale: [{ grayscale: [u] }],
        "hue-rotate": [{ "hue-rotate": [d] }],
        invert: [{ invert: [p] }],
        saturate: [{ saturate: [y] }],
        sepia: [{ sepia: [E] }],
        "backdrop-filter": [{ "backdrop-filter": ["", "none"] }],
        "backdrop-blur": [{ "backdrop-blur": [n] }],
        "backdrop-brightness": [{ "backdrop-brightness": [r] }],
        "backdrop-contrast": [{ "backdrop-contrast": [c] }],
        "backdrop-grayscale": [{ "backdrop-grayscale": [u] }],
        "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [d] }],
        "backdrop-invert": [{ "backdrop-invert": [p] }],
        "backdrop-opacity": [{ "backdrop-opacity": [g] }],
        "backdrop-saturate": [{ "backdrop-saturate": [y] }],
        "backdrop-sepia": [{ "backdrop-sepia": [E] }],
        "border-collapse": [{ border: ["collapse", "separate"] }],
        "border-spacing": [{ "border-spacing": [i] }],
        "border-spacing-x": [{ "border-spacing-x": [i] }],
        "border-spacing-y": [{ "border-spacing-y": [i] }],
        "table-layout": [{ table: ["auto", "fixed"] }],
        caption: [{ caption: ["top", "bottom"] }],
        transition: [
          {
            transition: [
              "none",
              "all",
              "",
              "colors",
              "opacity",
              "shadow",
              "transform",
              G,
            ],
          },
        ],
        duration: [{ duration: W() }],
        ease: [{ ease: ["linear", "in", "out", "in-out", G] }],
        delay: [{ delay: W() }],
        animate: [{ animate: ["none", "spin", "ping", "pulse", "bounce", G] }],
        transform: [{ transform: ["", "gpu", "none"] }],
        scale: [{ scale: [b] }],
        "scale-x": [{ "scale-x": [b] }],
        "scale-y": [{ "scale-y": [b] }],
        rotate: [{ rotate: [is, G] }],
        "translate-x": [{ "translate-x": [j] }],
        "translate-y": [{ "translate-y": [j] }],
        "skew-x": [{ "skew-x": [k] }],
        "skew-y": [{ "skew-y": [k] }],
        "transform-origin": [
          {
            origin: [
              "center",
              "top",
              "top-right",
              "right",
              "bottom-right",
              "bottom",
              "bottom-left",
              "left",
              "top-left",
              G,
            ],
          },
        ],
        accent: [{ accent: ["auto", e] }],
        appearance: [{ appearance: ["none", "auto"] }],
        cursor: [
          {
            cursor: [
              "auto",
              "default",
              "pointer",
              "wait",
              "text",
              "move",
              "help",
              "not-allowed",
              "none",
              "context-menu",
              "progress",
              "cell",
              "crosshair",
              "vertical-text",
              "alias",
              "copy",
              "no-drop",
              "grab",
              "grabbing",
              "all-scroll",
              "col-resize",
              "row-resize",
              "n-resize",
              "e-resize",
              "s-resize",
              "w-resize",
              "ne-resize",
              "nw-resize",
              "se-resize",
              "sw-resize",
              "ew-resize",
              "ns-resize",
              "nesw-resize",
              "nwse-resize",
              "zoom-in",
              "zoom-out",
              G,
            ],
          },
        ],
        "caret-color": [{ caret: [e] }],
        "pointer-events": [{ "pointer-events": ["none", "auto"] }],
        resize: [{ resize: ["none", "y", "x", ""] }],
        "scroll-behavior": [{ scroll: ["auto", "smooth"] }],
        "scroll-m": [{ "scroll-m": I() }],
        "scroll-mx": [{ "scroll-mx": I() }],
        "scroll-my": [{ "scroll-my": I() }],
        "scroll-ms": [{ "scroll-ms": I() }],
        "scroll-me": [{ "scroll-me": I() }],
        "scroll-mt": [{ "scroll-mt": I() }],
        "scroll-mr": [{ "scroll-mr": I() }],
        "scroll-mb": [{ "scroll-mb": I() }],
        "scroll-ml": [{ "scroll-ml": I() }],
        "scroll-p": [{ "scroll-p": I() }],
        "scroll-px": [{ "scroll-px": I() }],
        "scroll-py": [{ "scroll-py": I() }],
        "scroll-ps": [{ "scroll-ps": I() }],
        "scroll-pe": [{ "scroll-pe": I() }],
        "scroll-pt": [{ "scroll-pt": I() }],
        "scroll-pr": [{ "scroll-pr": I() }],
        "scroll-pb": [{ "scroll-pb": I() }],
        "scroll-pl": [{ "scroll-pl": I() }],
        "snap-align": [{ snap: ["start", "end", "center", "align-none"] }],
        "snap-stop": [{ snap: ["normal", "always"] }],
        "snap-type": [{ snap: ["none", "x", "y", "both"] }],
        "snap-strictness": [{ snap: ["mandatory", "proximity"] }],
        touch: [{ touch: ["auto", "none", "manipulation"] }],
        "touch-x": [{ "touch-pan": ["x", "left", "right"] }],
        "touch-y": [{ "touch-pan": ["y", "up", "down"] }],
        "touch-pz": ["touch-pinch-zoom"],
        select: [{ select: ["none", "text", "all", "auto"] }],
        "will-change": [
          { "will-change": ["auto", "scroll", "contents", "transform", G] },
        ],
        fill: [{ fill: [e, "none"] }],
        "stroke-w": [{ stroke: [rn, Nn, Ya] }],
        stroke: [{ stroke: [e, "none"] }],
        sr: ["sr-only", "not-sr-only"],
        "forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }],
      },
      conflictingClassGroups: {
        overflow: ["overflow-x", "overflow-y"],
        overscroll: ["overscroll-x", "overscroll-y"],
        inset: [
          "inset-x",
          "inset-y",
          "start",
          "end",
          "top",
          "right",
          "bottom",
          "left",
        ],
        "inset-x": ["right", "left"],
        "inset-y": ["top", "bottom"],
        flex: ["basis", "grow", "shrink"],
        gap: ["gap-x", "gap-y"],
        p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
        px: ["pr", "pl"],
        py: ["pt", "pb"],
        m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
        mx: ["mr", "ml"],
        my: ["mt", "mb"],
        size: ["w", "h"],
        "font-size": ["leading"],
        "fvn-normal": [
          "fvn-ordinal",
          "fvn-slashed-zero",
          "fvn-figure",
          "fvn-spacing",
          "fvn-fraction",
        ],
        "fvn-ordinal": ["fvn-normal"],
        "fvn-slashed-zero": ["fvn-normal"],
        "fvn-figure": ["fvn-normal"],
        "fvn-spacing": ["fvn-normal"],
        "fvn-fraction": ["fvn-normal"],
        "line-clamp": ["display", "overflow"],
        rounded: [
          "rounded-s",
          "rounded-e",
          "rounded-t",
          "rounded-r",
          "rounded-b",
          "rounded-l",
          "rounded-ss",
          "rounded-se",
          "rounded-ee",
          "rounded-es",
          "rounded-tl",
          "rounded-tr",
          "rounded-br",
          "rounded-bl",
        ],
        "rounded-s": ["rounded-ss", "rounded-es"],
        "rounded-e": ["rounded-se", "rounded-ee"],
        "rounded-t": ["rounded-tl", "rounded-tr"],
        "rounded-r": ["rounded-tr", "rounded-br"],
        "rounded-b": ["rounded-br", "rounded-bl"],
        "rounded-l": ["rounded-tl", "rounded-bl"],
        "border-spacing": ["border-spacing-x", "border-spacing-y"],
        "border-w": [
          "border-w-s",
          "border-w-e",
          "border-w-t",
          "border-w-r",
          "border-w-b",
          "border-w-l",
        ],
        "border-w-x": ["border-w-r", "border-w-l"],
        "border-w-y": ["border-w-t", "border-w-b"],
        "border-color": [
          "border-color-s",
          "border-color-e",
          "border-color-t",
          "border-color-r",
          "border-color-b",
          "border-color-l",
        ],
        "border-color-x": ["border-color-r", "border-color-l"],
        "border-color-y": ["border-color-t", "border-color-b"],
        "scroll-m": [
          "scroll-mx",
          "scroll-my",
          "scroll-ms",
          "scroll-me",
          "scroll-mt",
          "scroll-mr",
          "scroll-mb",
          "scroll-ml",
        ],
        "scroll-mx": ["scroll-mr", "scroll-ml"],
        "scroll-my": ["scroll-mt", "scroll-mb"],
        "scroll-p": [
          "scroll-px",
          "scroll-py",
          "scroll-ps",
          "scroll-pe",
          "scroll-pt",
          "scroll-pr",
          "scroll-pb",
          "scroll-pl",
        ],
        "scroll-px": ["scroll-pr", "scroll-pl"],
        "scroll-py": ["scroll-pt", "scroll-pb"],
        touch: ["touch-x", "touch-y", "touch-pz"],
        "touch-x": ["touch"],
        "touch-y": ["touch"],
        "touch-pz": ["touch"],
      },
      conflictingClassGroupModifiers: { "font-size": ["leading"] },
    };
  },
  FN = xN(DN);
function q(...e) {
  return FN(Yv(e));
}
const zN = UC,
  uy = f.forwardRef(({ className: e, ...t }, n) =>
    l.jsx(Bv, {
      ref: n,
      className: q(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        e,
      ),
      ...t,
    }),
  );
uy.displayName = Bv.displayName;
const $N = Fd(
    "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
    {
      variants: {
        variant: {
          default: "border bg-background text-foreground",
          destructive:
            "destructive group border-destructive bg-destructive text-destructive-foreground",
        },
      },
      defaultVariants: { variant: "default" },
    },
  ),
  dy = f.forwardRef(({ className: e, variant: t, ...n }, r) =>
    l.jsx(Hv, { ref: r, className: q($N({ variant: t }), e), ...n }),
  );
dy.displayName = Hv.displayName;
const UN = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx(Kv, {
    ref: n,
    className: q(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      e,
    ),
    ...t,
  }),
);
UN.displayName = Kv.displayName;
const fy = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx(Qv, {
    ref: n,
    className: q(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      e,
    ),
    "toast-close": "",
    ...t,
    children: l.jsx(ni, { className: "h-4 w-4" }),
  }),
);
fy.displayName = Qv.displayName;
const py = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx(Vv, { ref: n, className: q("text-sm font-semibold", e), ...t }),
);
py.displayName = Vv.displayName;
const hy = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx(Wv, { ref: n, className: q("text-sm opacity-90", e), ...t }),
);
hy.displayName = Wv.displayName;
function BN() {
  const { toasts: e } = Zb();
  return l.jsxs(zN, {
    children: [
      e.map(function ({ id: t, title: n, description: r, action: o, ...s }) {
        return l.jsxs(
          dy,
          {
            ...s,
            children: [
              l.jsxs("div", {
                className: "grid gap-1",
                children: [
                  n && l.jsx(py, { children: n }),
                  r && l.jsx(hy, { children: r }),
                ],
              }),
              o,
              l.jsx(fy, {}),
            ],
          },
          t,
        );
      }),
      l.jsx(uy, {}),
    ],
  });
}
var HN = Wh[" useId ".trim().toString()] || (() => {}),
  VN = 0;
function Zn(e) {
  const [t, n] = f.useState(HN());
  return (
    Ce(() => {
      n((r) => r ?? String(VN++));
    }, [e]),
    t ? `radix-${t}` : ""
  );
}
const WN = ["top", "right", "bottom", "left"],
  tr = Math.min,
  lt = Math.max,
  Nl = Math.round,
  ki = Math.floor,
  Zt = (e) => ({ x: e, y: e }),
  KN = { left: "right", right: "left", bottom: "top", top: "bottom" },
  QN = { start: "end", end: "start" };
function wu(e, t, n) {
  return lt(e, tr(t, n));
}
function xn(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function wn(e) {
  return e.split("-")[0];
}
function Ko(e) {
  return e.split("-")[1];
}
function Bd(e) {
  return e === "x" ? "y" : "x";
}
function Hd(e) {
  return e === "y" ? "height" : "width";
}
function nr(e) {
  return ["top", "bottom"].includes(wn(e)) ? "y" : "x";
}
function Vd(e) {
  return Bd(nr(e));
}
function GN(e, t, n) {
  n === void 0 && (n = !1);
  const r = Ko(e),
    o = Vd(e),
    s = Hd(o);
  let i =
    o === "x"
      ? r === (n ? "end" : "start")
        ? "right"
        : "left"
      : r === "start"
        ? "bottom"
        : "top";
  return (t.reference[s] > t.floating[s] && (i = El(i)), [i, El(i)]);
}
function YN(e) {
  const t = El(e);
  return [Su(e), t, Su(t)];
}
function Su(e) {
  return e.replace(/start|end/g, (t) => QN[t]);
}
function qN(e, t, n) {
  const r = ["left", "right"],
    o = ["right", "left"],
    s = ["top", "bottom"],
    i = ["bottom", "top"];
  switch (e) {
    case "top":
    case "bottom":
      return n ? (t ? o : r) : t ? r : o;
    case "left":
    case "right":
      return t ? s : i;
    default:
      return [];
  }
}
function XN(e, t, n, r) {
  const o = Ko(e);
  let s = qN(wn(e), n === "start", r);
  return (
    o && ((s = s.map((i) => i + "-" + o)), t && (s = s.concat(s.map(Su)))),
    s
  );
}
function El(e) {
  return e.replace(/left|right|bottom|top/g, (t) => KN[t]);
}
function ZN(e) {
  return { top: 0, right: 0, bottom: 0, left: 0, ...e };
}
function my(e) {
  return typeof e != "number"
    ? ZN(e)
    : { top: e, right: e, bottom: e, left: e };
}
function jl(e) {
  const { x: t, y: n, width: r, height: o } = e;
  return {
    width: r,
    height: o,
    top: n,
    left: t,
    right: t + r,
    bottom: n + o,
    x: t,
    y: n,
  };
}
function eh(e, t, n) {
  let { reference: r, floating: o } = e;
  const s = nr(t),
    i = Vd(t),
    a = Hd(i),
    c = wn(t),
    u = s === "y",
    d = r.x + r.width / 2 - o.width / 2,
    p = r.y + r.height / 2 - o.height / 2,
    h = r[a] / 2 - o[a] / 2;
  let x;
  switch (c) {
    case "top":
      x = { x: d, y: r.y - o.height };
      break;
    case "bottom":
      x = { x: d, y: r.y + r.height };
      break;
    case "right":
      x = { x: r.x + r.width, y: p };
      break;
    case "left":
      x = { x: r.x - o.width, y: p };
      break;
    default:
      x = { x: r.x, y: r.y };
  }
  switch (Ko(t)) {
    case "start":
      x[i] -= h * (n && u ? -1 : 1);
      break;
    case "end":
      x[i] += h * (n && u ? -1 : 1);
      break;
  }
  return x;
}
const JN = async (e, t, n) => {
  const {
      placement: r = "bottom",
      strategy: o = "absolute",
      middleware: s = [],
      platform: i,
    } = n,
    a = s.filter(Boolean),
    c = await (i.isRTL == null ? void 0 : i.isRTL(t));
  let u = await i.getElementRects({ reference: e, floating: t, strategy: o }),
    { x: d, y: p } = eh(u, r, c),
    h = r,
    x = {},
    S = 0;
  for (let v = 0; v < a.length; v++) {
    const { name: w, fn: g } = a[v],
      {
        x: m,
        y,
        data: b,
        reset: E,
      } = await g({
        x: d,
        y: p,
        initialPlacement: r,
        placement: h,
        strategy: o,
        middlewareData: x,
        rects: u,
        platform: i,
        elements: { reference: e, floating: t },
      });
    ((d = m ?? d),
      (p = y ?? p),
      (x = { ...x, [w]: { ...x[w], ...b } }),
      E &&
        S <= 50 &&
        (S++,
        typeof E == "object" &&
          (E.placement && (h = E.placement),
          E.rects &&
            (u =
              E.rects === !0
                ? await i.getElementRects({
                    reference: e,
                    floating: t,
                    strategy: o,
                  })
                : E.rects),
          ({ x: d, y: p } = eh(u, h, c))),
        (v = -1)));
  }
  return { x: d, y: p, placement: h, strategy: o, middlewareData: x };
};
async function Hs(e, t) {
  var n;
  t === void 0 && (t = {});
  const { x: r, y: o, platform: s, rects: i, elements: a, strategy: c } = e,
    {
      boundary: u = "clippingAncestors",
      rootBoundary: d = "viewport",
      elementContext: p = "floating",
      altBoundary: h = !1,
      padding: x = 0,
    } = xn(t, e),
    S = my(x),
    w = a[h ? (p === "floating" ? "reference" : "floating") : p],
    g = jl(
      await s.getClippingRect({
        element:
          (n = await (s.isElement == null ? void 0 : s.isElement(w))) == null ||
          n
            ? w
            : w.contextElement ||
              (await (s.getDocumentElement == null
                ? void 0
                : s.getDocumentElement(a.floating))),
        boundary: u,
        rootBoundary: d,
        strategy: c,
      }),
    ),
    m =
      p === "floating"
        ? { x: r, y: o, width: i.floating.width, height: i.floating.height }
        : i.reference,
    y = await (s.getOffsetParent == null
      ? void 0
      : s.getOffsetParent(a.floating)),
    b = (await (s.isElement == null ? void 0 : s.isElement(y)))
      ? (await (s.getScale == null ? void 0 : s.getScale(y))) || { x: 1, y: 1 }
      : { x: 1, y: 1 },
    E = jl(
      s.convertOffsetParentRelativeRectToViewportRelativeRect
        ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
            elements: a,
            rect: m,
            offsetParent: y,
            strategy: c,
          })
        : m,
    );
  return {
    top: (g.top - E.top + S.top) / b.y,
    bottom: (E.bottom - g.bottom + S.bottom) / b.y,
    left: (g.left - E.left + S.left) / b.x,
    right: (E.right - g.right + S.right) / b.x,
  };
}
const eE = (e) => ({
    name: "arrow",
    options: e,
    async fn(t) {
      const {
          x: n,
          y: r,
          placement: o,
          rects: s,
          platform: i,
          elements: a,
          middlewareData: c,
        } = t,
        { element: u, padding: d = 0 } = xn(e, t) || {};
      if (u == null) return {};
      const p = my(d),
        h = { x: n, y: r },
        x = Vd(o),
        S = Hd(x),
        v = await i.getDimensions(u),
        w = x === "y",
        g = w ? "top" : "left",
        m = w ? "bottom" : "right",
        y = w ? "clientHeight" : "clientWidth",
        b = s.reference[S] + s.reference[x] - h[x] - s.floating[S],
        E = h[x] - s.reference[x],
        k = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(u));
      let N = k ? k[y] : 0;
      (!N || !(await (i.isElement == null ? void 0 : i.isElement(k)))) &&
        (N = a.floating[y] || s.floating[S]);
      const j = b / 2 - E / 2,
        P = N / 2 - v[S] / 2 - 1,
        R = tr(p[g], P),
        M = tr(p[m], P),
        I = R,
        V = N - v[S] - M,
        O = N / 2 - v[S] / 2 + j,
        K = wu(I, O, V),
        F =
          !c.arrow &&
          Ko(o) != null &&
          O !== K &&
          s.reference[S] / 2 - (O < I ? R : M) - v[S] / 2 < 0,
        Q = F ? (O < I ? O - I : O - V) : 0;
      return {
        [x]: h[x] + Q,
        data: {
          [x]: K,
          centerOffset: O - K - Q,
          ...(F && { alignmentOffset: Q }),
        },
        reset: F,
      };
    },
  }),
  tE = function (e) {
    return (
      e === void 0 && (e = {}),
      {
        name: "flip",
        options: e,
        async fn(t) {
          var n, r;
          const {
              placement: o,
              middlewareData: s,
              rects: i,
              initialPlacement: a,
              platform: c,
              elements: u,
            } = t,
            {
              mainAxis: d = !0,
              crossAxis: p = !0,
              fallbackPlacements: h,
              fallbackStrategy: x = "bestFit",
              fallbackAxisSideDirection: S = "none",
              flipAlignment: v = !0,
              ...w
            } = xn(e, t);
          if ((n = s.arrow) != null && n.alignmentOffset) return {};
          const g = wn(o),
            m = nr(a),
            y = wn(a) === a,
            b = await (c.isRTL == null ? void 0 : c.isRTL(u.floating)),
            E = h || (y || !v ? [El(a)] : YN(a)),
            k = S !== "none";
          !h && k && E.push(...XN(a, v, S, b));
          const N = [a, ...E],
            j = await Hs(t, w),
            P = [];
          let R = ((r = s.flip) == null ? void 0 : r.overflows) || [];
          if ((d && P.push(j[g]), p)) {
            const O = GN(o, i, b);
            P.push(j[O[0]], j[O[1]]);
          }
          if (
            ((R = [...R, { placement: o, overflows: P }]),
            !P.every((O) => O <= 0))
          ) {
            var M, I;
            const O = (((M = s.flip) == null ? void 0 : M.index) || 0) + 1,
              K = N[O];
            if (K)
              return {
                data: { index: O, overflows: R },
                reset: { placement: K },
              };
            let F =
              (I = R.filter((Q) => Q.overflows[0] <= 0).sort(
                (Q, T) => Q.overflows[1] - T.overflows[1],
              )[0]) == null
                ? void 0
                : I.placement;
            if (!F)
              switch (x) {
                case "bestFit": {
                  var V;
                  const Q =
                    (V = R.filter((T) => {
                      if (k) {
                        const _ = nr(T.placement);
                        return _ === m || _ === "y";
                      }
                      return !0;
                    })
                      .map((T) => [
                        T.placement,
                        T.overflows
                          .filter((_) => _ > 0)
                          .reduce((_, z) => _ + z, 0),
                      ])
                      .sort((T, _) => T[1] - _[1])[0]) == null
                      ? void 0
                      : V[0];
                  Q && (F = Q);
                  break;
                }
                case "initialPlacement":
                  F = a;
                  break;
              }
            if (o !== F) return { reset: { placement: F } };
          }
          return {};
        },
      }
    );
  };
function th(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width,
  };
}
function nh(e) {
  return WN.some((t) => e[t] >= 0);
}
const nE = function (e) {
  return (
    e === void 0 && (e = {}),
    {
      name: "hide",
      options: e,
      async fn(t) {
        const { rects: n } = t,
          { strategy: r = "referenceHidden", ...o } = xn(e, t);
        switch (r) {
          case "referenceHidden": {
            const s = await Hs(t, { ...o, elementContext: "reference" }),
              i = th(s, n.reference);
            return {
              data: { referenceHiddenOffsets: i, referenceHidden: nh(i) },
            };
          }
          case "escaped": {
            const s = await Hs(t, { ...o, altBoundary: !0 }),
              i = th(s, n.floating);
            return { data: { escapedOffsets: i, escaped: nh(i) } };
          }
          default:
            return {};
        }
      },
    }
  );
};
async function rE(e, t) {
  const { placement: n, platform: r, elements: o } = e,
    s = await (r.isRTL == null ? void 0 : r.isRTL(o.floating)),
    i = wn(n),
    a = Ko(n),
    c = nr(n) === "y",
    u = ["left", "top"].includes(i) ? -1 : 1,
    d = s && c ? -1 : 1,
    p = xn(t, e);
  let {
    mainAxis: h,
    crossAxis: x,
    alignmentAxis: S,
  } = typeof p == "number"
    ? { mainAxis: p, crossAxis: 0, alignmentAxis: null }
    : {
        mainAxis: p.mainAxis || 0,
        crossAxis: p.crossAxis || 0,
        alignmentAxis: p.alignmentAxis,
      };
  return (
    a && typeof S == "number" && (x = a === "end" ? S * -1 : S),
    c ? { x: x * d, y: h * u } : { x: h * u, y: x * d }
  );
}
const oE = function (e) {
    return (
      e === void 0 && (e = 0),
      {
        name: "offset",
        options: e,
        async fn(t) {
          var n, r;
          const { x: o, y: s, placement: i, middlewareData: a } = t,
            c = await rE(t, e);
          return i === ((n = a.offset) == null ? void 0 : n.placement) &&
            (r = a.arrow) != null &&
            r.alignmentOffset
            ? {}
            : { x: o + c.x, y: s + c.y, data: { ...c, placement: i } };
        },
      }
    );
  },
  sE = function (e) {
    return (
      e === void 0 && (e = {}),
      {
        name: "shift",
        options: e,
        async fn(t) {
          const { x: n, y: r, placement: o } = t,
            {
              mainAxis: s = !0,
              crossAxis: i = !1,
              limiter: a = {
                fn: (w) => {
                  let { x: g, y: m } = w;
                  return { x: g, y: m };
                },
              },
              ...c
            } = xn(e, t),
            u = { x: n, y: r },
            d = await Hs(t, c),
            p = nr(wn(o)),
            h = Bd(p);
          let x = u[h],
            S = u[p];
          if (s) {
            const w = h === "y" ? "top" : "left",
              g = h === "y" ? "bottom" : "right",
              m = x + d[w],
              y = x - d[g];
            x = wu(m, x, y);
          }
          if (i) {
            const w = p === "y" ? "top" : "left",
              g = p === "y" ? "bottom" : "right",
              m = S + d[w],
              y = S - d[g];
            S = wu(m, S, y);
          }
          const v = a.fn({ ...t, [h]: x, [p]: S });
          return {
            ...v,
            data: { x: v.x - n, y: v.y - r, enabled: { [h]: s, [p]: i } },
          };
        },
      }
    );
  },
  iE = function (e) {
    return (
      e === void 0 && (e = {}),
      {
        options: e,
        fn(t) {
          const { x: n, y: r, placement: o, rects: s, middlewareData: i } = t,
            { offset: a = 0, mainAxis: c = !0, crossAxis: u = !0 } = xn(e, t),
            d = { x: n, y: r },
            p = nr(o),
            h = Bd(p);
          let x = d[h],
            S = d[p];
          const v = xn(a, t),
            w =
              typeof v == "number"
                ? { mainAxis: v, crossAxis: 0 }
                : { mainAxis: 0, crossAxis: 0, ...v };
          if (c) {
            const y = h === "y" ? "height" : "width",
              b = s.reference[h] - s.floating[y] + w.mainAxis,
              E = s.reference[h] + s.reference[y] - w.mainAxis;
            x < b ? (x = b) : x > E && (x = E);
          }
          if (u) {
            var g, m;
            const y = h === "y" ? "width" : "height",
              b = ["top", "left"].includes(wn(o)),
              E =
                s.reference[p] -
                s.floating[y] +
                ((b && ((g = i.offset) == null ? void 0 : g[p])) || 0) +
                (b ? 0 : w.crossAxis),
              k =
                s.reference[p] +
                s.reference[y] +
                (b ? 0 : ((m = i.offset) == null ? void 0 : m[p]) || 0) -
                (b ? w.crossAxis : 0);
            S < E ? (S = E) : S > k && (S = k);
          }
          return { [h]: x, [p]: S };
        },
      }
    );
  },
  lE = function (e) {
    return (
      e === void 0 && (e = {}),
      {
        name: "size",
        options: e,
        async fn(t) {
          var n, r;
          const { placement: o, rects: s, platform: i, elements: a } = t,
            { apply: c = () => {}, ...u } = xn(e, t),
            d = await Hs(t, u),
            p = wn(o),
            h = Ko(o),
            x = nr(o) === "y",
            { width: S, height: v } = s.floating;
          let w, g;
          p === "top" || p === "bottom"
            ? ((w = p),
              (g =
                h ===
                ((await (i.isRTL == null ? void 0 : i.isRTL(a.floating)))
                  ? "start"
                  : "end")
                  ? "left"
                  : "right"))
            : ((g = p), (w = h === "end" ? "top" : "bottom"));
          const m = v - d.top - d.bottom,
            y = S - d.left - d.right,
            b = tr(v - d[w], m),
            E = tr(S - d[g], y),
            k = !t.middlewareData.shift;
          let N = b,
            j = E;
          if (
            ((n = t.middlewareData.shift) != null && n.enabled.x && (j = y),
            (r = t.middlewareData.shift) != null && r.enabled.y && (N = m),
            k && !h)
          ) {
            const R = lt(d.left, 0),
              M = lt(d.right, 0),
              I = lt(d.top, 0),
              V = lt(d.bottom, 0);
            x
              ? (j = S - 2 * (R !== 0 || M !== 0 ? R + M : lt(d.left, d.right)))
              : (N =
                  v - 2 * (I !== 0 || V !== 0 ? I + V : lt(d.top, d.bottom)));
          }
          await c({ ...t, availableWidth: j, availableHeight: N });
          const P = await i.getDimensions(a.floating);
          return S !== P.width || v !== P.height
            ? { reset: { rects: !0 } }
            : {};
        },
      }
    );
  };
function na() {
  return typeof window < "u";
}
function Qo(e) {
  return gy(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function ut(e) {
  var t;
  return (
    (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) ||
    window
  );
}
function tn(e) {
  var t;
  return (t = (gy(e) ? e.ownerDocument : e.document) || window.document) == null
    ? void 0
    : t.documentElement;
}
function gy(e) {
  return na() ? e instanceof Node || e instanceof ut(e).Node : !1;
}
function Mt(e) {
  return na() ? e instanceof Element || e instanceof ut(e).Element : !1;
}
function Jt(e) {
  return na() ? e instanceof HTMLElement || e instanceof ut(e).HTMLElement : !1;
}
function rh(e) {
  return !na() || typeof ShadowRoot > "u"
    ? !1
    : e instanceof ShadowRoot || e instanceof ut(e).ShadowRoot;
}
function ri(e) {
  const { overflow: t, overflowX: n, overflowY: r, display: o } = Lt(e);
  return (
    /auto|scroll|overlay|hidden|clip/.test(t + r + n) &&
    !["inline", "contents"].includes(o)
  );
}
function aE(e) {
  return ["table", "td", "th"].includes(Qo(e));
}
function ra(e) {
  return [":popover-open", ":modal"].some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
function Wd(e) {
  const t = Kd(),
    n = Mt(e) ? Lt(e) : e;
  return (
    ["transform", "translate", "scale", "rotate", "perspective"].some((r) =>
      n[r] ? n[r] !== "none" : !1,
    ) ||
    (n.containerType ? n.containerType !== "normal" : !1) ||
    (!t && (n.backdropFilter ? n.backdropFilter !== "none" : !1)) ||
    (!t && (n.filter ? n.filter !== "none" : !1)) ||
    ["transform", "translate", "scale", "rotate", "perspective", "filter"].some(
      (r) => (n.willChange || "").includes(r),
    ) ||
    ["paint", "layout", "strict", "content"].some((r) =>
      (n.contain || "").includes(r),
    )
  );
}
function cE(e) {
  let t = rr(e);
  for (; Jt(t) && !Do(t); ) {
    if (Wd(t)) return t;
    if (ra(t)) return null;
    t = rr(t);
  }
  return null;
}
function Kd() {
  return typeof CSS > "u" || !CSS.supports
    ? !1
    : CSS.supports("-webkit-backdrop-filter", "none");
}
function Do(e) {
  return ["html", "body", "#document"].includes(Qo(e));
}
function Lt(e) {
  return ut(e).getComputedStyle(e);
}
function oa(e) {
  return Mt(e)
    ? { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop }
    : { scrollLeft: e.scrollX, scrollTop: e.scrollY };
}
function rr(e) {
  if (Qo(e) === "html") return e;
  const t = e.assignedSlot || e.parentNode || (rh(e) && e.host) || tn(e);
  return rh(t) ? t.host : t;
}
function vy(e) {
  const t = rr(e);
  return Do(t)
    ? e.ownerDocument
      ? e.ownerDocument.body
      : e.body
    : Jt(t) && ri(t)
      ? t
      : vy(t);
}
function Vs(e, t, n) {
  var r;
  (t === void 0 && (t = []), n === void 0 && (n = !0));
  const o = vy(e),
    s = o === ((r = e.ownerDocument) == null ? void 0 : r.body),
    i = ut(o);
  if (s) {
    const a = bu(i);
    return t.concat(
      i,
      i.visualViewport || [],
      ri(o) ? o : [],
      a && n ? Vs(a) : [],
    );
  }
  return t.concat(o, Vs(o, [], n));
}
function bu(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function yy(e) {
  const t = Lt(e);
  let n = parseFloat(t.width) || 0,
    r = parseFloat(t.height) || 0;
  const o = Jt(e),
    s = o ? e.offsetWidth : n,
    i = o ? e.offsetHeight : r,
    a = Nl(n) !== s || Nl(r) !== i;
  return (a && ((n = s), (r = i)), { width: n, height: r, $: a });
}
function Qd(e) {
  return Mt(e) ? e : e.contextElement;
}
function uo(e) {
  const t = Qd(e);
  if (!Jt(t)) return Zt(1);
  const n = t.getBoundingClientRect(),
    { width: r, height: o, $: s } = yy(t);
  let i = (s ? Nl(n.width) : n.width) / r,
    a = (s ? Nl(n.height) : n.height) / o;
  return (
    (!i || !Number.isFinite(i)) && (i = 1),
    (!a || !Number.isFinite(a)) && (a = 1),
    { x: i, y: a }
  );
}
const uE = Zt(0);
function xy(e) {
  const t = ut(e);
  return !Kd() || !t.visualViewport
    ? uE
    : { x: t.visualViewport.offsetLeft, y: t.visualViewport.offsetTop };
}
function dE(e, t, n) {
  return (t === void 0 && (t = !1), !n || (t && n !== ut(e)) ? !1 : t);
}
function Ir(e, t, n, r) {
  (t === void 0 && (t = !1), n === void 0 && (n = !1));
  const o = e.getBoundingClientRect(),
    s = Qd(e);
  let i = Zt(1);
  t && (r ? Mt(r) && (i = uo(r)) : (i = uo(e)));
  const a = dE(s, n, r) ? xy(s) : Zt(0);
  let c = (o.left + a.x) / i.x,
    u = (o.top + a.y) / i.y,
    d = o.width / i.x,
    p = o.height / i.y;
  if (s) {
    const h = ut(s),
      x = r && Mt(r) ? ut(r) : r;
    let S = h,
      v = bu(S);
    for (; v && r && x !== S; ) {
      const w = uo(v),
        g = v.getBoundingClientRect(),
        m = Lt(v),
        y = g.left + (v.clientLeft + parseFloat(m.paddingLeft)) * w.x,
        b = g.top + (v.clientTop + parseFloat(m.paddingTop)) * w.y;
      ((c *= w.x),
        (u *= w.y),
        (d *= w.x),
        (p *= w.y),
        (c += y),
        (u += b),
        (S = ut(v)),
        (v = bu(S)));
    }
  }
  return jl({ width: d, height: p, x: c, y: u });
}
function Gd(e, t) {
  const n = oa(e).scrollLeft;
  return t ? t.left + n : Ir(tn(e)).left + n;
}
function wy(e, t, n) {
  n === void 0 && (n = !1);
  const r = e.getBoundingClientRect(),
    o = r.left + t.scrollLeft - (n ? 0 : Gd(e, r)),
    s = r.top + t.scrollTop;
  return { x: o, y: s };
}
function fE(e) {
  let { elements: t, rect: n, offsetParent: r, strategy: o } = e;
  const s = o === "fixed",
    i = tn(r),
    a = t ? ra(t.floating) : !1;
  if (r === i || (a && s)) return n;
  let c = { scrollLeft: 0, scrollTop: 0 },
    u = Zt(1);
  const d = Zt(0),
    p = Jt(r);
  if (
    (p || (!p && !s)) &&
    ((Qo(r) !== "body" || ri(i)) && (c = oa(r)), Jt(r))
  ) {
    const x = Ir(r);
    ((u = uo(r)), (d.x = x.x + r.clientLeft), (d.y = x.y + r.clientTop));
  }
  const h = i && !p && !s ? wy(i, c, !0) : Zt(0);
  return {
    width: n.width * u.x,
    height: n.height * u.y,
    x: n.x * u.x - c.scrollLeft * u.x + d.x + h.x,
    y: n.y * u.y - c.scrollTop * u.y + d.y + h.y,
  };
}
function pE(e) {
  return Array.from(e.getClientRects());
}
function hE(e) {
  const t = tn(e),
    n = oa(e),
    r = e.ownerDocument.body,
    o = lt(t.scrollWidth, t.clientWidth, r.scrollWidth, r.clientWidth),
    s = lt(t.scrollHeight, t.clientHeight, r.scrollHeight, r.clientHeight);
  let i = -n.scrollLeft + Gd(e);
  const a = -n.scrollTop;
  return (
    Lt(r).direction === "rtl" && (i += lt(t.clientWidth, r.clientWidth) - o),
    { width: o, height: s, x: i, y: a }
  );
}
function mE(e, t) {
  const n = ut(e),
    r = tn(e),
    o = n.visualViewport;
  let s = r.clientWidth,
    i = r.clientHeight,
    a = 0,
    c = 0;
  if (o) {
    ((s = o.width), (i = o.height));
    const u = Kd();
    (!u || (u && t === "fixed")) && ((a = o.offsetLeft), (c = o.offsetTop));
  }
  return { width: s, height: i, x: a, y: c };
}
function gE(e, t) {
  const n = Ir(e, !0, t === "fixed"),
    r = n.top + e.clientTop,
    o = n.left + e.clientLeft,
    s = Jt(e) ? uo(e) : Zt(1),
    i = e.clientWidth * s.x,
    a = e.clientHeight * s.y,
    c = o * s.x,
    u = r * s.y;
  return { width: i, height: a, x: c, y: u };
}
function oh(e, t, n) {
  let r;
  if (t === "viewport") r = mE(e, n);
  else if (t === "document") r = hE(tn(e));
  else if (Mt(t)) r = gE(t, n);
  else {
    const o = xy(e);
    r = { x: t.x - o.x, y: t.y - o.y, width: t.width, height: t.height };
  }
  return jl(r);
}
function Sy(e, t) {
  const n = rr(e);
  return n === t || !Mt(n) || Do(n)
    ? !1
    : Lt(n).position === "fixed" || Sy(n, t);
}
function vE(e, t) {
  const n = t.get(e);
  if (n) return n;
  let r = Vs(e, [], !1).filter((a) => Mt(a) && Qo(a) !== "body"),
    o = null;
  const s = Lt(e).position === "fixed";
  let i = s ? rr(e) : e;
  for (; Mt(i) && !Do(i); ) {
    const a = Lt(i),
      c = Wd(i);
    (!c && a.position === "fixed" && (o = null),
      (
        s
          ? !c && !o
          : (!c &&
              a.position === "static" &&
              !!o &&
              ["absolute", "fixed"].includes(o.position)) ||
            (ri(i) && !c && Sy(e, i))
      )
        ? (r = r.filter((d) => d !== i))
        : (o = a),
      (i = rr(i)));
  }
  return (t.set(e, r), r);
}
function yE(e) {
  let { element: t, boundary: n, rootBoundary: r, strategy: o } = e;
  const i = [
      ...(n === "clippingAncestors"
        ? ra(t)
          ? []
          : vE(t, this._c)
        : [].concat(n)),
      r,
    ],
    a = i[0],
    c = i.reduce(
      (u, d) => {
        const p = oh(t, d, o);
        return (
          (u.top = lt(p.top, u.top)),
          (u.right = tr(p.right, u.right)),
          (u.bottom = tr(p.bottom, u.bottom)),
          (u.left = lt(p.left, u.left)),
          u
        );
      },
      oh(t, a, o),
    );
  return {
    width: c.right - c.left,
    height: c.bottom - c.top,
    x: c.left,
    y: c.top,
  };
}
function xE(e) {
  const { width: t, height: n } = yy(e);
  return { width: t, height: n };
}
function wE(e, t, n) {
  const r = Jt(t),
    o = tn(t),
    s = n === "fixed",
    i = Ir(e, !0, s, t);
  let a = { scrollLeft: 0, scrollTop: 0 };
  const c = Zt(0);
  if (r || (!r && !s))
    if (((Qo(t) !== "body" || ri(o)) && (a = oa(t)), r)) {
      const h = Ir(t, !0, s, t);
      ((c.x = h.x + t.clientLeft), (c.y = h.y + t.clientTop));
    } else o && (c.x = Gd(o));
  const u = o && !r && !s ? wy(o, a) : Zt(0),
    d = i.left + a.scrollLeft - c.x - u.x,
    p = i.top + a.scrollTop - c.y - u.y;
  return { x: d, y: p, width: i.width, height: i.height };
}
function qa(e) {
  return Lt(e).position === "static";
}
function sh(e, t) {
  if (!Jt(e) || Lt(e).position === "fixed") return null;
  if (t) return t(e);
  let n = e.offsetParent;
  return (tn(e) === n && (n = n.ownerDocument.body), n);
}
function by(e, t) {
  const n = ut(e);
  if (ra(e)) return n;
  if (!Jt(e)) {
    let o = rr(e);
    for (; o && !Do(o); ) {
      if (Mt(o) && !qa(o)) return o;
      o = rr(o);
    }
    return n;
  }
  let r = sh(e, t);
  for (; r && aE(r) && qa(r); ) r = sh(r, t);
  return r && Do(r) && qa(r) && !Wd(r) ? n : r || cE(e) || n;
}
const SE = async function (e) {
  const t = this.getOffsetParent || by,
    n = this.getDimensions,
    r = await n(e.floating);
  return {
    reference: wE(e.reference, await t(e.floating), e.strategy),
    floating: { x: 0, y: 0, width: r.width, height: r.height },
  };
};
function bE(e) {
  return Lt(e).direction === "rtl";
}
const CE = {
  convertOffsetParentRelativeRectToViewportRelativeRect: fE,
  getDocumentElement: tn,
  getClippingRect: yE,
  getOffsetParent: by,
  getElementRects: SE,
  getClientRects: pE,
  getDimensions: xE,
  getScale: uo,
  isElement: Mt,
  isRTL: bE,
};
function Cy(e, t) {
  return (
    e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height
  );
}
function NE(e, t) {
  let n = null,
    r;
  const o = tn(e);
  function s() {
    var a;
    (clearTimeout(r), (a = n) == null || a.disconnect(), (n = null));
  }
  function i(a, c) {
    (a === void 0 && (a = !1), c === void 0 && (c = 1), s());
    const u = e.getBoundingClientRect(),
      { left: d, top: p, width: h, height: x } = u;
    if ((a || t(), !h || !x)) return;
    const S = ki(p),
      v = ki(o.clientWidth - (d + h)),
      w = ki(o.clientHeight - (p + x)),
      g = ki(d),
      y = {
        rootMargin: -S + "px " + -v + "px " + -w + "px " + -g + "px",
        threshold: lt(0, tr(1, c)) || 1,
      };
    let b = !0;
    function E(k) {
      const N = k[0].intersectionRatio;
      if (N !== c) {
        if (!b) return i();
        N
          ? i(!1, N)
          : (r = setTimeout(() => {
              i(!1, 1e-7);
            }, 1e3));
      }
      (N === 1 && !Cy(u, e.getBoundingClientRect()) && i(), (b = !1));
    }
    try {
      n = new IntersectionObserver(E, { ...y, root: o.ownerDocument });
    } catch {
      n = new IntersectionObserver(E, y);
    }
    n.observe(e);
  }
  return (i(!0), s);
}
function EE(e, t, n, r) {
  r === void 0 && (r = {});
  const {
      ancestorScroll: o = !0,
      ancestorResize: s = !0,
      elementResize: i = typeof ResizeObserver == "function",
      layoutShift: a = typeof IntersectionObserver == "function",
      animationFrame: c = !1,
    } = r,
    u = Qd(e),
    d = o || s ? [...(u ? Vs(u) : []), ...Vs(t)] : [];
  d.forEach((g) => {
    (o && g.addEventListener("scroll", n, { passive: !0 }),
      s && g.addEventListener("resize", n));
  });
  const p = u && a ? NE(u, n) : null;
  let h = -1,
    x = null;
  i &&
    ((x = new ResizeObserver((g) => {
      let [m] = g;
      (m &&
        m.target === u &&
        x &&
        (x.unobserve(t),
        cancelAnimationFrame(h),
        (h = requestAnimationFrame(() => {
          var y;
          (y = x) == null || y.observe(t);
        }))),
        n());
    })),
    u && !c && x.observe(u),
    x.observe(t));
  let S,
    v = c ? Ir(e) : null;
  c && w();
  function w() {
    const g = Ir(e);
    (v && !Cy(v, g) && n(), (v = g), (S = requestAnimationFrame(w)));
  }
  return (
    n(),
    () => {
      var g;
      (d.forEach((m) => {
        (o && m.removeEventListener("scroll", n),
          s && m.removeEventListener("resize", n));
      }),
        p == null || p(),
        (g = x) == null || g.disconnect(),
        (x = null),
        c && cancelAnimationFrame(S));
    }
  );
}
const jE = oE,
  kE = sE,
  PE = tE,
  TE = lE,
  RE = nE,
  ih = eE,
  AE = iE,
  _E = (e, t, n) => {
    const r = new Map(),
      o = { platform: CE, ...n },
      s = { ...o.platform, _c: r };
    return JN(e, t, { ...o, platform: s });
  };
var Gi = typeof document < "u" ? f.useLayoutEffect : f.useEffect;
function kl(e, t) {
  if (e === t) return !0;
  if (typeof e != typeof t) return !1;
  if (typeof e == "function" && e.toString() === t.toString()) return !0;
  let n, r, o;
  if (e && t && typeof e == "object") {
    if (Array.isArray(e)) {
      if (((n = e.length), n !== t.length)) return !1;
      for (r = n; r-- !== 0; ) if (!kl(e[r], t[r])) return !1;
      return !0;
    }
    if (((o = Object.keys(e)), (n = o.length), n !== Object.keys(t).length))
      return !1;
    for (r = n; r-- !== 0; ) if (!{}.hasOwnProperty.call(t, o[r])) return !1;
    for (r = n; r-- !== 0; ) {
      const s = o[r];
      if (!(s === "_owner" && e.$$typeof) && !kl(e[s], t[s])) return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function Ny(e) {
  return typeof window > "u"
    ? 1
    : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function lh(e, t) {
  const n = Ny(e);
  return Math.round(t * n) / n;
}
function Xa(e) {
  const t = f.useRef(e);
  return (
    Gi(() => {
      t.current = e;
    }),
    t
  );
}
function OE(e) {
  e === void 0 && (e = {});
  const {
      placement: t = "bottom",
      strategy: n = "absolute",
      middleware: r = [],
      platform: o,
      elements: { reference: s, floating: i } = {},
      transform: a = !0,
      whileElementsMounted: c,
      open: u,
    } = e,
    [d, p] = f.useState({
      x: 0,
      y: 0,
      strategy: n,
      placement: t,
      middlewareData: {},
      isPositioned: !1,
    }),
    [h, x] = f.useState(r);
  kl(h, r) || x(r);
  const [S, v] = f.useState(null),
    [w, g] = f.useState(null),
    m = f.useCallback((T) => {
      T !== k.current && ((k.current = T), v(T));
    }, []),
    y = f.useCallback((T) => {
      T !== N.current && ((N.current = T), g(T));
    }, []),
    b = s || S,
    E = i || w,
    k = f.useRef(null),
    N = f.useRef(null),
    j = f.useRef(d),
    P = c != null,
    R = Xa(c),
    M = Xa(o),
    I = Xa(u),
    V = f.useCallback(() => {
      if (!k.current || !N.current) return;
      const T = { placement: t, strategy: n, middleware: h };
      (M.current && (T.platform = M.current),
        _E(k.current, N.current, T).then((_) => {
          const z = { ..._, isPositioned: I.current !== !1 };
          O.current &&
            !kl(j.current, z) &&
            ((j.current = z),
            zr.flushSync(() => {
              p(z);
            }));
        }));
    }, [h, t, n, M, I]);
  Gi(() => {
    u === !1 &&
      j.current.isPositioned &&
      ((j.current.isPositioned = !1), p((T) => ({ ...T, isPositioned: !1 })));
  }, [u]);
  const O = f.useRef(!1);
  (Gi(
    () => (
      (O.current = !0),
      () => {
        O.current = !1;
      }
    ),
    [],
  ),
    Gi(() => {
      if ((b && (k.current = b), E && (N.current = E), b && E)) {
        if (R.current) return R.current(b, E, V);
        V();
      }
    }, [b, E, V, R, P]));
  const K = f.useMemo(
      () => ({ reference: k, floating: N, setReference: m, setFloating: y }),
      [m, y],
    ),
    F = f.useMemo(() => ({ reference: b, floating: E }), [b, E]),
    Q = f.useMemo(() => {
      const T = { position: n, left: 0, top: 0 };
      if (!F.floating) return T;
      const _ = lh(F.floating, d.x),
        z = lh(F.floating, d.y);
      return a
        ? {
            ...T,
            transform: "translate(" + _ + "px, " + z + "px)",
            ...(Ny(F.floating) >= 1.5 && { willChange: "transform" }),
          }
        : { position: n, left: _, top: z };
    }, [n, a, F.floating, d.x, d.y]);
  return f.useMemo(
    () => ({ ...d, update: V, refs: K, elements: F, floatingStyles: Q }),
    [d, V, K, F, Q],
  );
}
const IE = (e) => {
    function t(n) {
      return {}.hasOwnProperty.call(n, "current");
    }
    return {
      name: "arrow",
      options: e,
      fn(n) {
        const { element: r, padding: o } = typeof e == "function" ? e(n) : e;
        return r && t(r)
          ? r.current != null
            ? ih({ element: r.current, padding: o }).fn(n)
            : {}
          : r
            ? ih({ element: r, padding: o }).fn(n)
            : {};
      },
    };
  },
  ME = (e, t) => ({ ...jE(e), options: [e, t] }),
  LE = (e, t) => ({ ...kE(e), options: [e, t] }),
  DE = (e, t) => ({ ...AE(e), options: [e, t] }),
  FE = (e, t) => ({ ...PE(e), options: [e, t] }),
  zE = (e, t) => ({ ...TE(e), options: [e, t] }),
  $E = (e, t) => ({ ...RE(e), options: [e, t] }),
  UE = (e, t) => ({ ...IE(e), options: [e, t] });
var BE = "Arrow",
  Ey = f.forwardRef((e, t) => {
    const { children: n, width: r = 10, height: o = 5, ...s } = e;
    return l.jsx(H.svg, {
      ...s,
      ref: t,
      width: r,
      height: o,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: e.asChild ? n : l.jsx("polygon", { points: "0,0 30,0 15,10" }),
    });
  });
Ey.displayName = BE;
var HE = Ey;
function VE(e) {
  const [t, n] = f.useState(void 0);
  return (
    Ce(() => {
      if (e) {
        n({ width: e.offsetWidth, height: e.offsetHeight });
        const r = new ResizeObserver((o) => {
          if (!Array.isArray(o) || !o.length) return;
          const s = o[0];
          let i, a;
          if ("borderBoxSize" in s) {
            const c = s.borderBoxSize,
              u = Array.isArray(c) ? c[0] : c;
            ((i = u.inlineSize), (a = u.blockSize));
          } else ((i = e.offsetWidth), (a = e.offsetHeight));
          n({ width: i, height: a });
        });
        return (r.observe(e, { box: "border-box" }), () => r.unobserve(e));
      } else n(void 0);
    }, [e]),
    t
  );
}
var Yd = "Popper",
  [jy, sa] = en(Yd),
  [WE, ky] = jy(Yd),
  Py = (e) => {
    const { __scopePopper: t, children: n } = e,
      [r, o] = f.useState(null);
    return l.jsx(WE, { scope: t, anchor: r, onAnchorChange: o, children: n });
  };
Py.displayName = Yd;
var Ty = "PopperAnchor",
  Ry = f.forwardRef((e, t) => {
    const { __scopePopper: n, virtualRef: r, ...o } = e,
      s = ky(Ty, n),
      i = f.useRef(null),
      a = te(t, i);
    return (
      f.useEffect(() => {
        s.onAnchorChange((r == null ? void 0 : r.current) || i.current);
      }),
      r ? null : l.jsx(H.div, { ...o, ref: a })
    );
  });
Ry.displayName = Ty;
var qd = "PopperContent",
  [KE, QE] = jy(qd),
  Ay = f.forwardRef((e, t) => {
    var B, ce, Le, le, se, ie;
    const {
        __scopePopper: n,
        side: r = "bottom",
        sideOffset: o = 0,
        align: s = "center",
        alignOffset: i = 0,
        arrowPadding: a = 0,
        avoidCollisions: c = !0,
        collisionBoundary: u = [],
        collisionPadding: d = 0,
        sticky: p = "partial",
        hideWhenDetached: h = !1,
        updatePositionStrategy: x = "optimized",
        onPlaced: S,
        ...v
      } = e,
      w = ky(qd, n),
      [g, m] = f.useState(null),
      y = te(t, (ot) => m(ot)),
      [b, E] = f.useState(null),
      k = VE(b),
      N = (k == null ? void 0 : k.width) ?? 0,
      j = (k == null ? void 0 : k.height) ?? 0,
      P = r + (s !== "center" ? "-" + s : ""),
      R =
        typeof d == "number"
          ? d
          : { top: 0, right: 0, bottom: 0, left: 0, ...d },
      M = Array.isArray(u) ? u : [u],
      I = M.length > 0,
      V = { padding: R, boundary: M.filter(YE), altBoundary: I },
      {
        refs: O,
        floatingStyles: K,
        placement: F,
        isPositioned: Q,
        middlewareData: T,
      } = OE({
        strategy: "fixed",
        placement: P,
        whileElementsMounted: (...ot) =>
          EE(...ot, { animationFrame: x === "always" }),
        elements: { reference: w.anchor },
        middleware: [
          ME({ mainAxis: o + j, alignmentAxis: i }),
          c &&
            LE({
              mainAxis: !0,
              crossAxis: !1,
              limiter: p === "partial" ? DE() : void 0,
              ...V,
            }),
          c && FE({ ...V }),
          zE({
            ...V,
            apply: ({
              elements: ot,
              rects: $t,
              availableWidth: Yo,
              availableHeight: qo,
            }) => {
              const { width: Xo, height: cw } = $t.reference,
                si = ot.floating.style;
              (si.setProperty("--radix-popper-available-width", `${Yo}px`),
                si.setProperty("--radix-popper-available-height", `${qo}px`),
                si.setProperty("--radix-popper-anchor-width", `${Xo}px`),
                si.setProperty("--radix-popper-anchor-height", `${cw}px`));
            },
          }),
          b && UE({ element: b, padding: a }),
          qE({ arrowWidth: N, arrowHeight: j }),
          h && $E({ strategy: "referenceHidden", ...V }),
        ],
      }),
      [_, z] = Iy(F),
      W = xe(S);
    Ce(() => {
      Q && (W == null || W());
    }, [Q, W]);
    const oe = (B = T.arrow) == null ? void 0 : B.x,
      Be = (ce = T.arrow) == null ? void 0 : ce.y,
      Ne = ((Le = T.arrow) == null ? void 0 : Le.centerOffset) !== 0,
      [zt, He] = f.useState();
    return (
      Ce(() => {
        g && He(window.getComputedStyle(g).zIndex);
      }, [g]),
      l.jsx("div", {
        ref: O.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...K,
          transform: Q ? K.transform : "translate(0, -200%)",
          minWidth: "max-content",
          zIndex: zt,
          "--radix-popper-transform-origin": [
            (le = T.transformOrigin) == null ? void 0 : le.x,
            (se = T.transformOrigin) == null ? void 0 : se.y,
          ].join(" "),
          ...(((ie = T.hide) == null ? void 0 : ie.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none",
          }),
        },
        dir: e.dir,
        children: l.jsx(KE, {
          scope: n,
          placedSide: _,
          onArrowChange: E,
          arrowX: oe,
          arrowY: Be,
          shouldHideArrow: Ne,
          children: l.jsx(H.div, {
            "data-side": _,
            "data-align": z,
            ...v,
            ref: y,
            style: { ...v.style, animation: Q ? void 0 : "none" },
          }),
        }),
      })
    );
  });
Ay.displayName = qd;
var _y = "PopperArrow",
  GE = { top: "bottom", right: "left", bottom: "top", left: "right" },
  Oy = f.forwardRef(function (t, n) {
    const { __scopePopper: r, ...o } = t,
      s = QE(_y, r),
      i = GE[s.placedSide];
    return l.jsx("span", {
      ref: s.onArrowChange,
      style: {
        position: "absolute",
        left: s.arrowX,
        top: s.arrowY,
        [i]: 0,
        transformOrigin: {
          top: "",
          right: "0 0",
          bottom: "center 0",
          left: "100% 0",
        }[s.placedSide],
        transform: {
          top: "translateY(100%)",
          right: "translateY(50%) rotate(90deg) translateX(-50%)",
          bottom: "rotate(180deg)",
          left: "translateY(50%) rotate(-90deg) translateX(50%)",
        }[s.placedSide],
        visibility: s.shouldHideArrow ? "hidden" : void 0,
      },
      children: l.jsx(HE, {
        ...o,
        ref: n,
        style: { ...o.style, display: "block" },
      }),
    });
  });
Oy.displayName = _y;
function YE(e) {
  return e !== null;
}
var qE = (e) => ({
  name: "transformOrigin",
  options: e,
  fn(t) {
    var w, g, m;
    const { placement: n, rects: r, middlewareData: o } = t,
      i = ((w = o.arrow) == null ? void 0 : w.centerOffset) !== 0,
      a = i ? 0 : e.arrowWidth,
      c = i ? 0 : e.arrowHeight,
      [u, d] = Iy(n),
      p = { start: "0%", center: "50%", end: "100%" }[d],
      h = (((g = o.arrow) == null ? void 0 : g.x) ?? 0) + a / 2,
      x = (((m = o.arrow) == null ? void 0 : m.y) ?? 0) + c / 2;
    let S = "",
      v = "";
    return (
      u === "bottom"
        ? ((S = i ? p : `${h}px`), (v = `${-c}px`))
        : u === "top"
          ? ((S = i ? p : `${h}px`), (v = `${r.floating.height + c}px`))
          : u === "right"
            ? ((S = `${-c}px`), (v = i ? p : `${x}px`))
            : u === "left" &&
              ((S = `${r.floating.width + c}px`), (v = i ? p : `${x}px`)),
      { data: { x: S, y: v } }
    );
  },
});
function Iy(e) {
  const [t, n = "center"] = e.split("-");
  return [t, n];
}
var XE = Py,
  My = Ry,
  Ly = Ay,
  Dy = Oy,
  [ia, $P] = en("Tooltip", [sa]),
  Xd = sa(),
  Fy = "TooltipProvider",
  ZE = 700,
  ah = "tooltip.open",
  [JE, zy] = ia(Fy),
  $y = (e) => {
    const {
        __scopeTooltip: t,
        delayDuration: n = ZE,
        skipDelayDuration: r = 300,
        disableHoverableContent: o = !1,
        children: s,
      } = e,
      i = f.useRef(!0),
      a = f.useRef(!1),
      c = f.useRef(0);
    return (
      f.useEffect(() => {
        const u = c.current;
        return () => window.clearTimeout(u);
      }, []),
      l.jsx(JE, {
        scope: t,
        isOpenDelayedRef: i,
        delayDuration: n,
        onOpen: f.useCallback(() => {
          (window.clearTimeout(c.current), (i.current = !1));
        }, []),
        onClose: f.useCallback(() => {
          (window.clearTimeout(c.current),
            (c.current = window.setTimeout(() => (i.current = !0), r)));
        }, [r]),
        isPointerInTransitRef: a,
        onPointerInTransitChange: f.useCallback((u) => {
          a.current = u;
        }, []),
        disableHoverableContent: o,
        children: s,
      })
    );
  };
$y.displayName = Fy;
var Uy = "Tooltip",
  [UP, la] = ia(Uy),
  Cu = "TooltipTrigger",
  ej = f.forwardRef((e, t) => {
    const { __scopeTooltip: n, ...r } = e,
      o = la(Cu, n),
      s = zy(Cu, n),
      i = Xd(n),
      a = f.useRef(null),
      c = te(t, a, o.onTriggerChange),
      u = f.useRef(!1),
      d = f.useRef(!1),
      p = f.useCallback(() => (u.current = !1), []);
    return (
      f.useEffect(
        () => () => document.removeEventListener("pointerup", p),
        [p],
      ),
      l.jsx(My, {
        asChild: !0,
        ...i,
        children: l.jsx(H.button, {
          "aria-describedby": o.open ? o.contentId : void 0,
          "data-state": o.stateAttribute,
          ...r,
          ref: c,
          onPointerMove: $(e.onPointerMove, (h) => {
            h.pointerType !== "touch" &&
              !d.current &&
              !s.isPointerInTransitRef.current &&
              (o.onTriggerEnter(), (d.current = !0));
          }),
          onPointerLeave: $(e.onPointerLeave, () => {
            (o.onTriggerLeave(), (d.current = !1));
          }),
          onPointerDown: $(e.onPointerDown, () => {
            (o.open && o.onClose(),
              (u.current = !0),
              document.addEventListener("pointerup", p, { once: !0 }));
          }),
          onFocus: $(e.onFocus, () => {
            u.current || o.onOpen();
          }),
          onBlur: $(e.onBlur, o.onClose),
          onClick: $(e.onClick, o.onClose),
        }),
      })
    );
  });
ej.displayName = Cu;
var tj = "TooltipPortal",
  [BP, nj] = ia(tj, { forceMount: void 0 }),
  Fo = "TooltipContent",
  By = f.forwardRef((e, t) => {
    const n = nj(Fo, e.__scopeTooltip),
      { forceMount: r = n.forceMount, side: o = "top", ...s } = e,
      i = la(Fo, e.__scopeTooltip);
    return l.jsx(Dt, {
      present: r || i.open,
      children: i.disableHoverableContent
        ? l.jsx(Hy, { side: o, ...s, ref: t })
        : l.jsx(rj, { side: o, ...s, ref: t }),
    });
  }),
  rj = f.forwardRef((e, t) => {
    const n = la(Fo, e.__scopeTooltip),
      r = zy(Fo, e.__scopeTooltip),
      o = f.useRef(null),
      s = te(t, o),
      [i, a] = f.useState(null),
      { trigger: c, onClose: u } = n,
      d = o.current,
      { onPointerInTransitChange: p } = r,
      h = f.useCallback(() => {
        (a(null), p(!1));
      }, [p]),
      x = f.useCallback(
        (S, v) => {
          const w = S.currentTarget,
            g = { x: S.clientX, y: S.clientY },
            m = aj(g, w.getBoundingClientRect()),
            y = cj(g, m),
            b = uj(v.getBoundingClientRect()),
            E = fj([...y, ...b]);
          (a(E), p(!0));
        },
        [p],
      );
    return (
      f.useEffect(() => () => h(), [h]),
      f.useEffect(() => {
        if (c && d) {
          const S = (w) => x(w, d),
            v = (w) => x(w, c);
          return (
            c.addEventListener("pointerleave", S),
            d.addEventListener("pointerleave", v),
            () => {
              (c.removeEventListener("pointerleave", S),
                d.removeEventListener("pointerleave", v));
            }
          );
        }
      }, [c, d, x, h]),
      f.useEffect(() => {
        if (i) {
          const S = (v) => {
            const w = v.target,
              g = { x: v.clientX, y: v.clientY },
              m =
                (c == null ? void 0 : c.contains(w)) ||
                (d == null ? void 0 : d.contains(w)),
              y = !dj(g, i);
            m ? h() : y && (h(), u());
          };
          return (
            document.addEventListener("pointermove", S),
            () => document.removeEventListener("pointermove", S)
          );
        }
      }, [c, d, i, u, h]),
      l.jsx(Hy, { ...e, ref: s })
    );
  }),
  [oj, sj] = ia(Uy, { isInside: !1 }),
  ij = rC("TooltipContent"),
  Hy = f.forwardRef((e, t) => {
    const {
        __scopeTooltip: n,
        children: r,
        "aria-label": o,
        onEscapeKeyDown: s,
        onPointerDownOutside: i,
        ...a
      } = e,
      c = la(Fo, n),
      u = Xd(n),
      { onClose: d } = c;
    return (
      f.useEffect(
        () => (
          document.addEventListener(ah, d),
          () => document.removeEventListener(ah, d)
        ),
        [d],
      ),
      f.useEffect(() => {
        if (c.trigger) {
          const p = (h) => {
            const x = h.target;
            x != null && x.contains(c.trigger) && d();
          };
          return (
            window.addEventListener("scroll", p, { capture: !0 }),
            () => window.removeEventListener("scroll", p, { capture: !0 })
          );
        }
      }, [c.trigger, d]),
      l.jsx(ei, {
        asChild: !0,
        disableOutsidePointerEvents: !1,
        onEscapeKeyDown: s,
        onPointerDownOutside: i,
        onFocusOutside: (p) => p.preventDefault(),
        onDismiss: d,
        children: l.jsxs(Ly, {
          "data-state": c.stateAttribute,
          ...u,
          ...a,
          ref: t,
          style: {
            ...a.style,
            "--radix-tooltip-content-transform-origin":
              "var(--radix-popper-transform-origin)",
            "--radix-tooltip-content-available-width":
              "var(--radix-popper-available-width)",
            "--radix-tooltip-content-available-height":
              "var(--radix-popper-available-height)",
            "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-tooltip-trigger-height":
              "var(--radix-popper-anchor-height)",
          },
          children: [
            l.jsx(ij, { children: r }),
            l.jsx(oj, {
              scope: n,
              isInside: !0,
              children: l.jsx(CC, {
                id: c.contentId,
                role: "tooltip",
                children: o || r,
              }),
            }),
          ],
        }),
      })
    );
  });
By.displayName = Fo;
var Vy = "TooltipArrow",
  lj = f.forwardRef((e, t) => {
    const { __scopeTooltip: n, ...r } = e,
      o = Xd(n);
    return sj(Vy, n).isInside ? null : l.jsx(Dy, { ...o, ...r, ref: t });
  });
lj.displayName = Vy;
function aj(e, t) {
  const n = Math.abs(t.top - e.y),
    r = Math.abs(t.bottom - e.y),
    o = Math.abs(t.right - e.x),
    s = Math.abs(t.left - e.x);
  switch (Math.min(n, r, o, s)) {
    case s:
      return "left";
    case o:
      return "right";
    case n:
      return "top";
    case r:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function cj(e, t, n = 5) {
  const r = [];
  switch (t) {
    case "top":
      r.push({ x: e.x - n, y: e.y + n }, { x: e.x + n, y: e.y + n });
      break;
    case "bottom":
      r.push({ x: e.x - n, y: e.y - n }, { x: e.x + n, y: e.y - n });
      break;
    case "left":
      r.push({ x: e.x + n, y: e.y - n }, { x: e.x + n, y: e.y + n });
      break;
    case "right":
      r.push({ x: e.x - n, y: e.y - n }, { x: e.x - n, y: e.y + n });
      break;
  }
  return r;
}
function uj(e) {
  const { top: t, right: n, bottom: r, left: o } = e;
  return [
    { x: o, y: t },
    { x: n, y: t },
    { x: n, y: r },
    { x: o, y: r },
  ];
}
function dj(e, t) {
  const { x: n, y: r } = e;
  let o = !1;
  for (let s = 0, i = t.length - 1; s < t.length; i = s++) {
    const a = t[s].x,
      c = t[s].y,
      u = t[i].x,
      d = t[i].y;
    c > r != d > r && n < ((u - a) * (r - c)) / (d - c) + a && (o = !o);
  }
  return o;
}
function fj(e) {
  const t = e.slice();
  return (
    t.sort((n, r) =>
      n.x < r.x ? -1 : n.x > r.x ? 1 : n.y < r.y ? -1 : n.y > r.y ? 1 : 0,
    ),
    pj(t)
  );
}
function pj(e) {
  if (e.length <= 1) return e.slice();
  const t = [];
  for (let r = 0; r < e.length; r++) {
    const o = e[r];
    for (; t.length >= 2; ) {
      const s = t[t.length - 1],
        i = t[t.length - 2];
      if ((s.x - i.x) * (o.y - i.y) >= (s.y - i.y) * (o.x - i.x)) t.pop();
      else break;
    }
    t.push(o);
  }
  t.pop();
  const n = [];
  for (let r = e.length - 1; r >= 0; r--) {
    const o = e[r];
    for (; n.length >= 2; ) {
      const s = n[n.length - 1],
        i = n[n.length - 2];
      if ((s.x - i.x) * (o.y - i.y) >= (s.y - i.y) * (o.x - i.x)) n.pop();
      else break;
    }
    n.push(o);
  }
  return (
    n.pop(),
    t.length === 1 && n.length === 1 && t[0].x === n[0].x && t[0].y === n[0].y
      ? t
      : t.concat(n)
  );
}
var hj = $y,
  Wy = By;
const mj = hj,
  gj = f.forwardRef(({ className: e, sideOffset: t = 4, ...n }, r) =>
    l.jsx(Wy, {
      ref: r,
      sideOffset: t,
      className: q(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
        e,
      ),
      ...n,
    }),
  );
gj.displayName = Wy.displayName;
const vj = { theme: "system", setTheme: () => null },
  Ky = f.createContext(vj);
function yj({
  children: e,
  defaultTheme: t = "system",
  storageKey: n = "edura-ui-theme",
  ...r
}) {
  const [o, s] = f.useState(() => localStorage.getItem(n) || t);
  f.useEffect(() => {
    const a = window.document.documentElement;
    if ((a.classList.remove("light", "dark"), o === "system")) {
      const c = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      a.classList.add(c);
      return;
    }
    a.classList.add(o);
  }, [o]);
  const i = {
    theme: o,
    setTheme: (a) => {
      (localStorage.setItem(n, a), s(a));
    },
  };
  return l.jsx(Ky.Provider, { ...r, value: i, children: e });
}
const xj = () => {
    const e = f.useContext(Ky);
    if (e === void 0)
      throw new Error("useTheme must be used within a ThemeProvider");
    return e;
  },
  wj = Fd(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2",
    {
      variants: {
        variant: {
          default:
            "bg-primary text-primary-foreground border border-primary-border",
          destructive:
            "bg-destructive text-destructive-foreground border border-destructive-border",
          outline:
            " border [border-color:var(--button-outline)]  shadow-xs active:shadow-none ",
          secondary:
            "border bg-secondary text-secondary-foreground border border-secondary-border ",
          ghost: "border border-transparent",
        },
        size: {
          default: "min-h-9 px-4 py-2",
          sm: "min-h-8 rounded-md px-3 text-xs",
          lg: "min-h-10 rounded-md px-8",
          icon: "h-9 w-9",
        },
      },
      defaultVariants: { variant: "default", size: "default" },
    },
  ),
  we = f.forwardRef(
    ({ className: e, variant: t, size: n, asChild: r = !1, ...o }, s) => {
      const i = r ? tC : "button";
      return l.jsx(i, {
        className: q(wj({ variant: t, size: n, className: e })),
        ref: s,
        ...o,
      });
    },
  );
we.displayName = "Button";
function Sj() {
  const { theme: e, setTheme: t } = xj();
  return l.jsxs(we, {
    variant: "ghost",
    size: "icon",
    onClick: () => t(e === "light" ? "dark" : "light"),
    "data-testid": "button-theme-toggle",
    children: [
      l.jsx(rN, {
        className:
          "h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0",
      }),
      l.jsx(JC, {
        className:
          "absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100",
      }),
      l.jsx("span", { className: "sr-only", children: "Toggle theme" }),
    ],
  });
}
const Qy = [
  { path: "/", label: "Home", icon: Xt },
  { path: "/educators", label: "Educators", icon: Or },
  { path: "/deadlines", label: "Deadlines", icon: yn },
  { path: "/bookmarks", label: "Bookmarks", icon: zd },
];
function bj() {
  const [e] = Pd();
  return l.jsx("header", {
    className:
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
    children: l.jsx("div", {
      className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
      children: l.jsxs("div", {
        className: "flex h-16 items-center justify-between gap-4",
        children: [
          l.jsxs(xt, {
            href: "/",
            className: "flex items-center gap-2",
            children: [
              l.jsx("div", {
                className:
                  "flex h-9 w-9 items-center justify-center rounded-md bg-primary",
                children: l.jsx(Xt, {
                  className: "h-5 w-5 text-primary-foreground",
                }),
              }),
              l.jsx("span", {
                className: "text-xl font-semibold",
                "data-testid": "text-logo",
                children: "Edura",
              }),
            ],
          }),
          l.jsx("nav", {
            className: "hidden md:flex items-center gap-1",
            children: Qy.map((t) => {
              const n = e === t.path;
              return l.jsx(
                xt,
                {
                  href: t.path,
                  children: l.jsxs(we, {
                    variant: n ? "secondary" : "ghost",
                    size: "sm",
                    className: "gap-2",
                    "data-testid": `link-nav-${t.label.toLowerCase()}`,
                    children: [
                      l.jsx(t.icon, { className: "h-4 w-4" }),
                      t.label,
                    ],
                  }),
                },
                t.path,
              );
            }),
          }),
          l.jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              l.jsx(xt, {
                href: "/chat",
                children: l.jsxs(we, {
                  variant: "outline",
                  size: "sm",
                  className: "gap-2",
                  "data-testid": "link-ai-helper",
                  children: [
                    l.jsx(ty, { className: "h-4 w-4" }),
                    l.jsx("span", {
                      className: "hidden sm:inline",
                      children: "AI Helper",
                    }),
                  ],
                }),
              }),
              l.jsx(Sj, {}),
            ],
          }),
        ],
      }),
    }),
  });
}
function Cj() {
  const [e] = Pd();
  return l.jsx("nav", {
    className:
      "fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden",
    children: l.jsxs("div", {
      className: "flex items-center justify-around py-2",
      children: [
        Qy.map((t) => {
          const n = e === t.path;
          return l.jsx(
            xt,
            {
              href: t.path,
              children: l.jsxs(we, {
                variant: "ghost",
                size: "sm",
                className: `flex-col gap-1 h-auto py-2 ${n ? "text-primary" : "text-muted-foreground"}`,
                "data-testid": `link-mobile-${t.label.toLowerCase()}`,
                children: [
                  l.jsx(t.icon, { className: "h-5 w-5" }),
                  l.jsx("span", { className: "text-xs", children: t.label }),
                ],
              }),
            },
            t.path,
          );
        }),
        l.jsx(xt, {
          href: "/chat",
          children: l.jsxs(we, {
            variant: "ghost",
            size: "sm",
            className: `flex-col gap-1 h-auto py-2 ${e === "/chat" ? "text-primary" : "text-muted-foreground"}`,
            "data-testid": "link-mobile-chat",
            children: [
              l.jsx(ty, { className: "h-5 w-5" }),
              l.jsx("span", { className: "text-xs", children: "AI Help" }),
            ],
          }),
        }),
      ],
    }),
  });
}
const Zd = f.forwardRef(({ className: e, type: t, ...n }, r) =>
  l.jsx("input", {
    type: t,
    className: q(
      "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      e,
    ),
    ref: r,
    ...n,
  }),
);
Zd.displayName = "Input";
const Nj = Fd(
  "whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate ",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-xs",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-xs",
        outline: " border [border-color:var(--badge-outline)] shadow-xs",
      },
    },
    defaultVariants: { variant: "default" },
  },
);
function _e({ className: e, variant: t, ...n }) {
  return l.jsx("div", { className: q(Nj({ variant: t }), e), ...n });
}
const Ej = { exam: Xt, course: Bs, educator: Or, skill: Cl },
  jj = {
    exam: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    course: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    educator:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    skill:
      "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  };
function Gy({
  size: e = "default",
  placeholder: t = "Search exams, courses, educators...",
  autoFocus: n = !1,
}) {
  const [r, o] = f.useState(""),
    [s, i] = f.useState([]),
    [a, c] = f.useState(!1),
    [u, d] = f.useState(!1),
    [, p] = Pd(),
    h = f.useRef(null),
    x = f.useRef(null);
  (f.useEffect(() => {
    const g = (m) => {
      x.current && !x.current.contains(m.target) && c(!1);
    };
    return (
      document.addEventListener("mousedown", g),
      () => document.removeEventListener("mousedown", g)
    );
  }, []),
    f.useEffect(() => {
      if (!r.trim()) {
        i([]);
        return;
      }
      const g = setTimeout(async () => {
        d(!0);
        try {
          const m = await fetch(`/api/search?q=${encodeURIComponent(r)}`);
          if (m.ok) {
            const y = await m.json();
            (i(y), c(!0));
          }
        } catch (m) {
          console.error("Search failed:", m);
        } finally {
          d(!1);
        }
      }, 300);
      return () => clearTimeout(g);
    }, [r]));
  const S = (g) => {
      (c(!1),
        o(""),
        g.type === "exam"
          ? p(`/exam/${g.id}`)
          : g.type === "course"
            ? p(`/search?exam=${g.id}`)
            : g.type === "educator" && p(`/educators?id=${g.id}`));
    },
    v = (g) => {
      g.key === "Enter" &&
        r.trim() &&
        (c(!1), p(`/search?q=${encodeURIComponent(r)}`));
    },
    w = e === "large";
  return l.jsxs("div", {
    ref: x,
    className: "relative w-full",
    children: [
      l.jsxs("div", {
        className: `relative ${w ? "shadow-lg" : ""}`,
        children: [
          l.jsx(ny, {
            className: `absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground ${w ? "h-5 w-5" : "h-4 w-4"}`,
          }),
          l.jsx(Zd, {
            ref: h,
            type: "search",
            placeholder: t,
            value: r,
            onChange: (g) => o(g.target.value),
            onFocus: () => s.length > 0 && c(!0),
            onKeyDown: v,
            autoFocus: n,
            className: `${w ? "h-14 text-lg pl-12 pr-12" : "h-10 pl-10 pr-10"} rounded-lg bg-background border-input`,
            "data-testid": "input-search",
          }),
          r &&
            l.jsx(we, {
              variant: "ghost",
              size: "icon",
              className: `absolute right-2 top-1/2 -translate-y-1/2 ${w ? "h-8 w-8" : "h-6 w-6"}`,
              onClick: () => {
                var g;
                (o(""), i([]), (g = h.current) == null || g.focus());
              },
              "data-testid": "button-clear-search",
              children: l.jsx(ni, { className: "h-4 w-4" }),
            }),
        ],
      }),
      a &&
        s.length > 0 &&
        l.jsx("div", {
          className:
            "absolute top-full left-0 right-0 mt-2 rounded-lg border bg-popover shadow-xl z-50 overflow-hidden",
          "data-testid": "search-results-dropdown",
          children: l.jsx("div", {
            className: "max-h-96 overflow-y-auto",
            children: s.map((g) => {
              const m = Ej[g.type] || Xt;
              return l.jsxs(
                "button",
                {
                  onClick: () => S(g),
                  className:
                    "w-full flex items-center gap-3 px-4 py-3 hover-elevate text-left transition-colors",
                  "data-testid": `search-result-${g.type}-${g.id}`,
                  children: [
                    l.jsx("div", {
                      className: `flex h-10 w-10 items-center justify-center rounded-md ${jj[g.type]}`,
                      children: l.jsx(m, { className: "h-5 w-5" }),
                    }),
                    l.jsxs("div", {
                      className: "flex-1 min-w-0",
                      children: [
                        l.jsx("p", {
                          className: "font-medium truncate",
                          children: g.title,
                        }),
                        g.subtitle &&
                          l.jsx("p", {
                            className: "text-sm text-muted-foreground truncate",
                            children: g.subtitle,
                          }),
                      ],
                    }),
                    l.jsx(_e, {
                      variant: "secondary",
                      className: "capitalize text-xs",
                      children: g.type,
                    }),
                  ],
                },
                `${g.type}-${g.id}`,
              );
            }),
          }),
        }),
      u &&
        l.jsx("div", {
          className:
            "absolute top-full left-0 right-0 mt-2 rounded-lg border bg-popover shadow-lg p-4 text-center text-sm text-muted-foreground",
          children: "Searching...",
        }),
    ],
  });
}
const Te = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx("div", {
    ref: n,
    className: q(
      "shadcn-card rounded-xl border bg-card border-card-border text-card-foreground shadow-sm",
      e,
    ),
    ...t,
  }),
);
Te.displayName = "Card";
const an = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx("div", {
    ref: n,
    className: q("flex flex-col space-y-1.5 p-6", e),
    ...t,
  }),
);
an.displayName = "CardHeader";
const dr = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx("div", {
    ref: n,
    className: q("text-2xl font-semibold leading-none tracking-tight", e),
    ...t,
  }),
);
dr.displayName = "CardTitle";
const kj = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx("div", {
    ref: n,
    className: q("text-sm text-muted-foreground", e),
    ...t,
  }),
);
kj.displayName = "CardDescription";
const Re = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx("div", { ref: n, className: q("p-6 pt-0", e), ...t }),
);
Re.displayName = "CardContent";
const Jd = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx("div", { ref: n, className: q("flex items-center p-6 pt-0", e), ...t }),
);
Jd.displayName = "CardFooter";
const Pj = [
    { id: "gate", name: "GATE", category: "Engineering", candidates: "10L+" },
    {
      id: "jee-main",
      name: "JEE Main",
      category: "Engineering",
      candidates: "12L+",
    },
    { id: "cat", name: "CAT", category: "Management", candidates: "2.5L+" },
    {
      id: "upsc-cse",
      name: "UPSC CSE",
      category: "Civil Services",
      candidates: "10L+",
    },
    { id: "neet", name: "NEET UG", category: "Medical", candidates: "20L+" },
    { id: "cuet", name: "CUET UG", category: "University", candidates: "15L+" },
  ],
  Tj = [
    {
      icon: Xt,
      title: "Exam Discovery",
      description:
        "Find the right exam for your career goals with detailed insights and eligibility info.",
    },
    {
      icon: oy,
      title: "Course Comparison",
      description:
        "Compare courses from top providers side-by-side to make informed decisions.",
    },
    {
      icon: Or,
      title: "Educator Discovery",
      description:
        "Discover educators across YouTube, Unacademy, and more based on teaching style.",
    },
    {
      icon: yn,
      title: "Deadline Tracker",
      description:
        "Never miss important exam forms, internships, or scholarship deadlines.",
    },
  ];
function Rj() {
  return l.jsxs("div", {
    className: "min-h-screen pb-20 md:pb-0",
    children: [
      l.jsx("section", {
        className:
          "relative bg-gradient-to-b from-primary/5 to-background py-16 md:py-24",
        children: l.jsxs("div", {
          className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center",
          children: [
            l.jsxs(_e, {
              variant: "secondary",
              className: "mb-4",
              children: [
                l.jsx(Cl, { className: "h-3 w-3 mr-1" }),
                "AI-Powered Education Discovery",
              ],
            }),
            l.jsxs("h1", {
              className: "text-4xl md:text-5xl font-bold tracking-tight mb-4",
              "data-testid": "text-hero-title",
              children: [
                "Find Your Perfect Course,",
                l.jsx("br", {}),
                l.jsx("span", {
                  className: "text-primary",
                  children: "Without the Confusion",
                }),
              ],
            }),
            l.jsx("p", {
              className: "text-lg text-muted-foreground mb-8 max-w-2xl mx-auto",
              children:
                "Discover, compare, and choose the right courses, exams, and educators for your learning journey. No bias, no missed deadlines.",
            }),
            l.jsx("div", {
              className: "max-w-2xl mx-auto",
              children: l.jsx(Gy, {
                size: "large",
                autoFocus: !0,
                placeholder: "Search exams like GATE, JEE, CAT, UPSC...",
              }),
            }),
            l.jsxs("div", {
              className: "flex flex-wrap justify-center gap-2 mt-6",
              children: [
                l.jsx("span", {
                  className: "text-sm text-muted-foreground",
                  children: "Popular:",
                }),
                ["GATE", "JEE", "CAT", "UPSC"].map((e) =>
                  l.jsx(
                    xt,
                    {
                      href: `/search?q=${e}`,
                      children: l.jsx(_e, {
                        variant: "outline",
                        className: "cursor-pointer hover-elevate",
                        "data-testid": `badge-popular-${e.toLowerCase()}`,
                        children: e,
                      }),
                    },
                    e,
                  ),
                ),
              ],
            }),
          ],
        }),
      }),
      l.jsx("section", {
        className: "py-12 md:py-16",
        children: l.jsxs("div", {
          className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          children: [
            l.jsxs("div", {
              className: "flex items-center justify-between mb-8",
              children: [
                l.jsxs("div", {
                  children: [
                    l.jsx("h2", {
                      className: "text-2xl font-semibold",
                      children: "Popular Exams",
                    }),
                    l.jsx("p", {
                      className: "text-muted-foreground",
                      children:
                        "Explore courses for India's top competitive exams",
                    }),
                  ],
                }),
                l.jsx(xt, {
                  href: "/search",
                  children: l.jsxs(we, {
                    variant: "ghost",
                    className: "gap-1",
                    "data-testid": "link-view-all-exams",
                    children: [
                      "View all ",
                      l.jsx(yu, { className: "h-4 w-4" }),
                    ],
                  }),
                }),
              ],
            }),
            l.jsx("div", {
              className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4",
              children: Pj.map((e) =>
                l.jsx(
                  xt,
                  {
                    href: `/exam/${e.id}`,
                    children: l.jsx(Te, {
                      className: "hover-elevate cursor-pointer h-full",
                      "data-testid": `card-exam-${e.id}`,
                      children: l.jsxs(Re, {
                        className: "p-4 text-center",
                        children: [
                          l.jsx("div", {
                            className:
                              "h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-3",
                            children: l.jsx(Xt, {
                              className: "h-6 w-6 text-primary",
                            }),
                          }),
                          l.jsx("h3", {
                            className: "font-semibold",
                            children: e.name,
                          }),
                          l.jsx("p", {
                            className: "text-xs text-muted-foreground mt-1",
                            children: e.category,
                          }),
                          l.jsxs(_e, {
                            variant: "secondary",
                            className: "mt-2 text-xs",
                            children: [e.candidates, " candidates"],
                          }),
                        ],
                      }),
                    }),
                  },
                  e.id,
                ),
              ),
            }),
          ],
        }),
      }),
      l.jsx("section", {
        className: "py-12 md:py-16 bg-muted/30",
        children: l.jsxs("div", {
          className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          children: [
            l.jsxs("div", {
              className: "text-center mb-12",
              children: [
                l.jsx("h2", {
                  className: "text-2xl md:text-3xl font-semibold mb-3",
                  children: "Everything You Need to Succeed",
                }),
                l.jsx("p", {
                  className: "text-muted-foreground max-w-2xl mx-auto",
                  children:
                    "From exam discovery to course comparison, we've got you covered at every step.",
                }),
              ],
            }),
            l.jsx("div", {
              className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6",
              children: Tj.map((e) =>
                l.jsx(
                  Te,
                  {
                    className: "overflow-visible",
                    children: l.jsxs(Re, {
                      className: "p-6",
                      children: [
                        l.jsx("div", {
                          className:
                            "h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center mb-4",
                          children: l.jsx(e.icon, {
                            className: "h-6 w-6 text-primary",
                          }),
                        }),
                        l.jsx("h3", {
                          className: "font-semibold mb-2",
                          children: e.title,
                        }),
                        l.jsx("p", {
                          className: "text-sm text-muted-foreground",
                          children: e.description,
                        }),
                      ],
                    }),
                  },
                  e.title,
                ),
              ),
            }),
          ],
        }),
      }),
      l.jsx("section", {
        className: "py-12 md:py-16",
        children: l.jsx("div", {
          className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center",
          children: l.jsx(Te, {
            className: "bg-primary text-primary-foreground overflow-hidden",
            children: l.jsxs(Re, {
              className: "p-8 md:p-12",
              children: [
                l.jsx(Cl, { className: "h-12 w-12 mx-auto mb-4 opacity-80" }),
                l.jsx("h2", {
                  className: "text-2xl md:text-3xl font-semibold mb-3",
                  children: "Need Help Choosing?",
                }),
                l.jsx("p", {
                  className: "opacity-90 mb-6 max-w-xl mx-auto",
                  children:
                    "Our AI Study Helper can explain exam structures, compare courses, and help you make the right decision.",
                }),
                l.jsx(xt, {
                  href: "/chat",
                  children: l.jsxs(we, {
                    variant: "secondary",
                    size: "lg",
                    className: "gap-2",
                    "data-testid": "button-try-ai-helper",
                    children: [
                      "Try AI Study Helper",
                      l.jsx(yu, { className: "h-4 w-4" }),
                    ],
                  }),
                }),
              ],
            }),
          }),
        }),
      }),
    ],
  });
}
const Aj = {
    PhysicsWallah: "bg-blue-600",
    Unacademy: "bg-green-600",
    Byjus: "bg-purple-600",
    MadeEasy: "bg-red-600",
    AceAcademy: "bg-orange-600",
    YouTube: "bg-red-500",
    Other: "bg-gray-600",
  },
  _j = { Live: Ga, Recorded: Ga, Hybrid: Ga };
function ef({ course: e, isSelected: t, onSelect: n, onViewDetails: r }) {
  const o = _j[e.mode],
    s = e.originalPrice
      ? Math.round(((e.originalPrice - e.price) / e.originalPrice) * 100)
      : 0;
  return l.jsxs(Te, {
    className: `relative overflow-visible transition-all ${t ? "ring-2 ring-primary" : ""}`,
    "data-testid": `card-course-${e.id}`,
    children: [
      l.jsxs(an, {
        className: "pb-3",
        children: [
          l.jsxs("div", {
            className: "flex items-start justify-between gap-2",
            children: [
              l.jsxs("div", {
                className: "flex items-center gap-2",
                children: [
                  l.jsx("div", {
                    className: `h-8 w-8 rounded-md ${Aj[e.provider]} flex items-center justify-center`,
                    children: l.jsx("span", {
                      className: "text-white text-xs font-bold",
                      children: e.provider.charAt(0),
                    }),
                  }),
                  l.jsx("span", {
                    className: "text-sm font-medium text-muted-foreground",
                    "data-testid": `text-provider-${e.id}`,
                    children: e.provider,
                  }),
                ],
              }),
              e.rating &&
                l.jsxs("div", {
                  className: "flex items-center gap-1 text-sm",
                  children: [
                    l.jsx(ry, {
                      className: "h-4 w-4 fill-yellow-400 text-yellow-400",
                    }),
                    l.jsx("span", {
                      className: "font-medium",
                      children: e.rating.toFixed(1),
                    }),
                  ],
                }),
            ],
          }),
          l.jsx("h3", {
            className: "font-semibold text-lg leading-tight line-clamp-2 mt-2",
            "data-testid": `text-course-name-${e.id}`,
            children: e.name,
          }),
        ],
      }),
      l.jsxs(Re, {
        className: "pb-3 space-y-3",
        children: [
          l.jsx(_e, {
            variant: "secondary",
            className: "text-xs",
            "data-testid": `badge-best-for-${e.id}`,
            children: e.bestFor,
          }),
          l.jsxs("div", {
            className: "flex flex-wrap gap-2",
            children: [
              l.jsxs("div", {
                className:
                  "flex items-center gap-1 text-sm text-muted-foreground",
                children: [
                  l.jsx(Jv, { className: "h-3.5 w-3.5" }),
                  l.jsx("span", { children: e.duration }),
                ],
              }),
              l.jsxs("div", {
                className:
                  "flex items-center gap-1 text-sm text-muted-foreground",
                children: [
                  l.jsx(o, { className: "h-3.5 w-3.5" }),
                  l.jsx("span", { children: e.mode }),
                ],
              }),
              l.jsxs("div", {
                className:
                  "flex items-center gap-1 text-sm text-muted-foreground",
                children: [
                  l.jsx(XC, { className: "h-3.5 w-3.5" }),
                  l.jsx("span", { children: e.language }),
                ],
              }),
            ],
          }),
          l.jsxs("div", {
            className: "flex items-center gap-1 text-sm text-muted-foreground",
            children: [
              l.jsx(yn, { className: "h-3.5 w-3.5" }),
              l.jsxs("span", { children: ["Target: ", e.targetYear] }),
            ],
          }),
          l.jsxs("div", {
            className: "flex items-baseline gap-2 pt-2",
            children: [
              l.jsx("span", {
                className: "text-2xl font-bold",
                "data-testid": `text-price-${e.id}`,
                children:
                  e.price === 0 ? "Free" : `₹${e.price.toLocaleString()}`,
              }),
              e.originalPrice &&
                e.originalPrice > e.price &&
                l.jsxs(l.Fragment, {
                  children: [
                    l.jsxs("span", {
                      className: "text-sm text-muted-foreground line-through",
                      children: ["₹", e.originalPrice.toLocaleString()],
                    }),
                    l.jsxs(_e, {
                      className:
                        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                      children: [s, "% off"],
                    }),
                  ],
                }),
            ],
          }),
        ],
      }),
      l.jsxs(Jd, {
        className: "flex gap-2 pt-0",
        children: [
          n &&
            l.jsx(we, {
              variant: t ? "default" : "outline",
              size: "sm",
              className: "flex-1",
              onClick: () => n(e),
              "data-testid": `button-compare-${e.id}`,
              children: t
                ? l.jsxs(l.Fragment, {
                    children: [
                      l.jsx($d, { className: "h-4 w-4 mr-1" }),
                      "Selected",
                    ],
                  })
                : l.jsxs(l.Fragment, {
                    children: [
                      l.jsx(eN, { className: "h-4 w-4 mr-1" }),
                      "Compare",
                    ],
                  }),
            }),
          r &&
            l.jsx(we, {
              variant: "ghost",
              size: "sm",
              className: n ? "" : "flex-1",
              onClick: () => r(e),
              "data-testid": `button-view-${e.id}`,
              children: "View Details",
            }),
        ],
      }),
    ],
  });
}
function Yy() {
  return l.jsxs(Te, {
    className: "overflow-hidden",
    children: [
      l.jsxs(an, {
        className: "pb-3",
        children: [
          l.jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              l.jsx("div", {
                className: "h-8 w-8 rounded-md bg-muted animate-pulse",
              }),
              l.jsx("div", {
                className: "h-4 w-24 bg-muted animate-pulse rounded",
              }),
            ],
          }),
          l.jsx("div", {
            className: "h-6 w-full bg-muted animate-pulse rounded mt-2",
          }),
          l.jsx("div", {
            className: "h-6 w-3/4 bg-muted animate-pulse rounded mt-1",
          }),
        ],
      }),
      l.jsxs(Re, {
        className: "pb-3 space-y-3",
        children: [
          l.jsx("div", {
            className: "h-5 w-32 bg-muted animate-pulse rounded-full",
          }),
          l.jsxs("div", {
            className: "flex gap-4",
            children: [
              l.jsx("div", {
                className: "h-4 w-20 bg-muted animate-pulse rounded",
              }),
              l.jsx("div", {
                className: "h-4 w-20 bg-muted animate-pulse rounded",
              }),
            ],
          }),
          l.jsx("div", {
            className: "h-8 w-28 bg-muted animate-pulse rounded mt-2",
          }),
        ],
      }),
      l.jsx(Jd, {
        className: "gap-2 pt-0",
        children: l.jsx("div", {
          className: "h-9 flex-1 bg-muted animate-pulse rounded",
        }),
      }),
    ],
  });
}
var Oj = f.createContext(void 0);
function aa(e) {
  const t = f.useContext(Oj);
  return e || t || "ltr";
}
function Nu(e, [t, n]) {
  return Math.min(n, Math.max(t, e));
}
function Ij(e, t) {
  return f.useReducer((n, r) => t[n][r] ?? n, e);
}
var tf = "ScrollArea",
  [qy, HP] = en(tf),
  [Mj, Ct] = qy(tf),
  Xy = f.forwardRef((e, t) => {
    const {
        __scopeScrollArea: n,
        type: r = "hover",
        dir: o,
        scrollHideDelay: s = 600,
        ...i
      } = e,
      [a, c] = f.useState(null),
      [u, d] = f.useState(null),
      [p, h] = f.useState(null),
      [x, S] = f.useState(null),
      [v, w] = f.useState(null),
      [g, m] = f.useState(0),
      [y, b] = f.useState(0),
      [E, k] = f.useState(!1),
      [N, j] = f.useState(!1),
      P = te(t, (M) => c(M)),
      R = aa(o);
    return l.jsx(Mj, {
      scope: n,
      type: r,
      dir: R,
      scrollHideDelay: s,
      scrollArea: a,
      viewport: u,
      onViewportChange: d,
      content: p,
      onContentChange: h,
      scrollbarX: x,
      onScrollbarXChange: S,
      scrollbarXEnabled: E,
      onScrollbarXEnabledChange: k,
      scrollbarY: v,
      onScrollbarYChange: w,
      scrollbarYEnabled: N,
      onScrollbarYEnabledChange: j,
      onCornerWidthChange: m,
      onCornerHeightChange: b,
      children: l.jsx(H.div, {
        dir: R,
        ...i,
        ref: P,
        style: {
          position: "relative",
          "--radix-scroll-area-corner-width": g + "px",
          "--radix-scroll-area-corner-height": y + "px",
          ...e.style,
        },
      }),
    });
  });
Xy.displayName = tf;
var Zy = "ScrollAreaViewport",
  Jy = f.forwardRef((e, t) => {
    const { __scopeScrollArea: n, children: r, nonce: o, ...s } = e,
      i = Ct(Zy, n),
      a = f.useRef(null),
      c = te(t, a, i.onViewportChange);
    return l.jsxs(l.Fragment, {
      children: [
        l.jsx("style", {
          dangerouslySetInnerHTML: {
            __html:
              "[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}",
          },
          nonce: o,
        }),
        l.jsx(H.div, {
          "data-radix-scroll-area-viewport": "",
          ...s,
          ref: c,
          style: {
            overflowX: i.scrollbarXEnabled ? "scroll" : "hidden",
            overflowY: i.scrollbarYEnabled ? "scroll" : "hidden",
            ...e.style,
          },
          children: l.jsx("div", {
            ref: i.onContentChange,
            style: { minWidth: "100%", display: "table" },
            children: r,
          }),
        }),
      ],
    });
  });
Jy.displayName = Zy;
var nn = "ScrollAreaScrollbar",
  nf = f.forwardRef((e, t) => {
    const { forceMount: n, ...r } = e,
      o = Ct(nn, e.__scopeScrollArea),
      { onScrollbarXEnabledChange: s, onScrollbarYEnabledChange: i } = o,
      a = e.orientation === "horizontal";
    return (
      f.useEffect(
        () => (
          a ? s(!0) : i(!0),
          () => {
            a ? s(!1) : i(!1);
          }
        ),
        [a, s, i],
      ),
      o.type === "hover"
        ? l.jsx(Lj, { ...r, ref: t, forceMount: n })
        : o.type === "scroll"
          ? l.jsx(Dj, { ...r, ref: t, forceMount: n })
          : o.type === "auto"
            ? l.jsx(ex, { ...r, ref: t, forceMount: n })
            : o.type === "always"
              ? l.jsx(rf, { ...r, ref: t })
              : null
    );
  });
nf.displayName = nn;
var Lj = f.forwardRef((e, t) => {
    const { forceMount: n, ...r } = e,
      o = Ct(nn, e.__scopeScrollArea),
      [s, i] = f.useState(!1);
    return (
      f.useEffect(() => {
        const a = o.scrollArea;
        let c = 0;
        if (a) {
          const u = () => {
              (window.clearTimeout(c), i(!0));
            },
            d = () => {
              c = window.setTimeout(() => i(!1), o.scrollHideDelay);
            };
          return (
            a.addEventListener("pointerenter", u),
            a.addEventListener("pointerleave", d),
            () => {
              (window.clearTimeout(c),
                a.removeEventListener("pointerenter", u),
                a.removeEventListener("pointerleave", d));
            }
          );
        }
      }, [o.scrollArea, o.scrollHideDelay]),
      l.jsx(Dt, {
        present: n || s,
        children: l.jsx(ex, {
          "data-state": s ? "visible" : "hidden",
          ...r,
          ref: t,
        }),
      })
    );
  }),
  Dj = f.forwardRef((e, t) => {
    const { forceMount: n, ...r } = e,
      o = Ct(nn, e.__scopeScrollArea),
      s = e.orientation === "horizontal",
      i = ua(() => c("SCROLL_END"), 100),
      [a, c] = Ij("hidden", {
        hidden: { SCROLL: "scrolling" },
        scrolling: { SCROLL_END: "idle", POINTER_ENTER: "interacting" },
        interacting: { SCROLL: "interacting", POINTER_LEAVE: "idle" },
        idle: {
          HIDE: "hidden",
          SCROLL: "scrolling",
          POINTER_ENTER: "interacting",
        },
      });
    return (
      f.useEffect(() => {
        if (a === "idle") {
          const u = window.setTimeout(() => c("HIDE"), o.scrollHideDelay);
          return () => window.clearTimeout(u);
        }
      }, [a, o.scrollHideDelay, c]),
      f.useEffect(() => {
        const u = o.viewport,
          d = s ? "scrollLeft" : "scrollTop";
        if (u) {
          let p = u[d];
          const h = () => {
            const x = u[d];
            (p !== x && (c("SCROLL"), i()), (p = x));
          };
          return (
            u.addEventListener("scroll", h),
            () => u.removeEventListener("scroll", h)
          );
        }
      }, [o.viewport, s, c, i]),
      l.jsx(Dt, {
        present: n || a !== "hidden",
        children: l.jsx(rf, {
          "data-state": a === "hidden" ? "hidden" : "visible",
          ...r,
          ref: t,
          onPointerEnter: $(e.onPointerEnter, () => c("POINTER_ENTER")),
          onPointerLeave: $(e.onPointerLeave, () => c("POINTER_LEAVE")),
        }),
      })
    );
  }),
  ex = f.forwardRef((e, t) => {
    const n = Ct(nn, e.__scopeScrollArea),
      { forceMount: r, ...o } = e,
      [s, i] = f.useState(!1),
      a = e.orientation === "horizontal",
      c = ua(() => {
        if (n.viewport) {
          const u = n.viewport.offsetWidth < n.viewport.scrollWidth,
            d = n.viewport.offsetHeight < n.viewport.scrollHeight;
          i(a ? u : d);
        }
      }, 10);
    return (
      zo(n.viewport, c),
      zo(n.content, c),
      l.jsx(Dt, {
        present: r || s,
        children: l.jsx(rf, {
          "data-state": s ? "visible" : "hidden",
          ...o,
          ref: t,
        }),
      })
    );
  }),
  rf = f.forwardRef((e, t) => {
    const { orientation: n = "vertical", ...r } = e,
      o = Ct(nn, e.__scopeScrollArea),
      s = f.useRef(null),
      i = f.useRef(0),
      [a, c] = f.useState({
        content: 0,
        viewport: 0,
        scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 },
      }),
      u = sx(a.viewport, a.content),
      d = {
        ...r,
        sizes: a,
        onSizesChange: c,
        hasThumb: u > 0 && u < 1,
        onThumbChange: (h) => (s.current = h),
        onThumbPointerUp: () => (i.current = 0),
        onThumbPointerDown: (h) => (i.current = h),
      };
    function p(h, x) {
      return Hj(h, i.current, a, x);
    }
    return n === "horizontal"
      ? l.jsx(Fj, {
          ...d,
          ref: t,
          onThumbPositionChange: () => {
            if (o.viewport && s.current) {
              const h = o.viewport.scrollLeft,
                x = ch(h, a, o.dir);
              s.current.style.transform = `translate3d(${x}px, 0, 0)`;
            }
          },
          onWheelScroll: (h) => {
            o.viewport && (o.viewport.scrollLeft = h);
          },
          onDragScroll: (h) => {
            o.viewport && (o.viewport.scrollLeft = p(h, o.dir));
          },
        })
      : n === "vertical"
        ? l.jsx(zj, {
            ...d,
            ref: t,
            onThumbPositionChange: () => {
              if (o.viewport && s.current) {
                const h = o.viewport.scrollTop,
                  x = ch(h, a);
                s.current.style.transform = `translate3d(0, ${x}px, 0)`;
              }
            },
            onWheelScroll: (h) => {
              o.viewport && (o.viewport.scrollTop = h);
            },
            onDragScroll: (h) => {
              o.viewport && (o.viewport.scrollTop = p(h));
            },
          })
        : null;
  }),
  Fj = f.forwardRef((e, t) => {
    const { sizes: n, onSizesChange: r, ...o } = e,
      s = Ct(nn, e.__scopeScrollArea),
      [i, a] = f.useState(),
      c = f.useRef(null),
      u = te(t, c, s.onScrollbarXChange);
    return (
      f.useEffect(() => {
        c.current && a(getComputedStyle(c.current));
      }, [c]),
      l.jsx(nx, {
        "data-orientation": "horizontal",
        ...o,
        ref: u,
        sizes: n,
        style: {
          bottom: 0,
          left: s.dir === "rtl" ? "var(--radix-scroll-area-corner-width)" : 0,
          right: s.dir === "ltr" ? "var(--radix-scroll-area-corner-width)" : 0,
          "--radix-scroll-area-thumb-width": ca(n) + "px",
          ...e.style,
        },
        onThumbPointerDown: (d) => e.onThumbPointerDown(d.x),
        onDragScroll: (d) => e.onDragScroll(d.x),
        onWheelScroll: (d, p) => {
          if (s.viewport) {
            const h = s.viewport.scrollLeft + d.deltaX;
            (e.onWheelScroll(h), lx(h, p) && d.preventDefault());
          }
        },
        onResize: () => {
          c.current &&
            s.viewport &&
            i &&
            r({
              content: s.viewport.scrollWidth,
              viewport: s.viewport.offsetWidth,
              scrollbar: {
                size: c.current.clientWidth,
                paddingStart: Tl(i.paddingLeft),
                paddingEnd: Tl(i.paddingRight),
              },
            });
        },
      })
    );
  }),
  zj = f.forwardRef((e, t) => {
    const { sizes: n, onSizesChange: r, ...o } = e,
      s = Ct(nn, e.__scopeScrollArea),
      [i, a] = f.useState(),
      c = f.useRef(null),
      u = te(t, c, s.onScrollbarYChange);
    return (
      f.useEffect(() => {
        c.current && a(getComputedStyle(c.current));
      }, [c]),
      l.jsx(nx, {
        "data-orientation": "vertical",
        ...o,
        ref: u,
        sizes: n,
        style: {
          top: 0,
          right: s.dir === "ltr" ? 0 : void 0,
          left: s.dir === "rtl" ? 0 : void 0,
          bottom: "var(--radix-scroll-area-corner-height)",
          "--radix-scroll-area-thumb-height": ca(n) + "px",
          ...e.style,
        },
        onThumbPointerDown: (d) => e.onThumbPointerDown(d.y),
        onDragScroll: (d) => e.onDragScroll(d.y),
        onWheelScroll: (d, p) => {
          if (s.viewport) {
            const h = s.viewport.scrollTop + d.deltaY;
            (e.onWheelScroll(h), lx(h, p) && d.preventDefault());
          }
        },
        onResize: () => {
          c.current &&
            s.viewport &&
            i &&
            r({
              content: s.viewport.scrollHeight,
              viewport: s.viewport.offsetHeight,
              scrollbar: {
                size: c.current.clientHeight,
                paddingStart: Tl(i.paddingTop),
                paddingEnd: Tl(i.paddingBottom),
              },
            });
        },
      })
    );
  }),
  [$j, tx] = qy(nn),
  nx = f.forwardRef((e, t) => {
    const {
        __scopeScrollArea: n,
        sizes: r,
        hasThumb: o,
        onThumbChange: s,
        onThumbPointerUp: i,
        onThumbPointerDown: a,
        onThumbPositionChange: c,
        onDragScroll: u,
        onWheelScroll: d,
        onResize: p,
        ...h
      } = e,
      x = Ct(nn, n),
      [S, v] = f.useState(null),
      w = te(t, (P) => v(P)),
      g = f.useRef(null),
      m = f.useRef(""),
      y = x.viewport,
      b = r.content - r.viewport,
      E = xe(d),
      k = xe(c),
      N = ua(p, 10);
    function j(P) {
      if (g.current) {
        const R = P.clientX - g.current.left,
          M = P.clientY - g.current.top;
        u({ x: R, y: M });
      }
    }
    return (
      f.useEffect(() => {
        const P = (R) => {
          const M = R.target;
          (S == null ? void 0 : S.contains(M)) && E(R, b);
        };
        return (
          document.addEventListener("wheel", P, { passive: !1 }),
          () => document.removeEventListener("wheel", P, { passive: !1 })
        );
      }, [y, S, b, E]),
      f.useEffect(k, [r, k]),
      zo(S, N),
      zo(x.content, N),
      l.jsx($j, {
        scope: n,
        scrollbar: S,
        hasThumb: o,
        onThumbChange: xe(s),
        onThumbPointerUp: xe(i),
        onThumbPositionChange: k,
        onThumbPointerDown: xe(a),
        children: l.jsx(H.div, {
          ...h,
          ref: w,
          style: { position: "absolute", ...h.style },
          onPointerDown: $(e.onPointerDown, (P) => {
            P.button === 0 &&
              (P.target.setPointerCapture(P.pointerId),
              (g.current = S.getBoundingClientRect()),
              (m.current = document.body.style.webkitUserSelect),
              (document.body.style.webkitUserSelect = "none"),
              x.viewport && (x.viewport.style.scrollBehavior = "auto"),
              j(P));
          }),
          onPointerMove: $(e.onPointerMove, j),
          onPointerUp: $(e.onPointerUp, (P) => {
            const R = P.target;
            (R.hasPointerCapture(P.pointerId) &&
              R.releasePointerCapture(P.pointerId),
              (document.body.style.webkitUserSelect = m.current),
              x.viewport && (x.viewport.style.scrollBehavior = ""),
              (g.current = null));
          }),
        }),
      })
    );
  }),
  Pl = "ScrollAreaThumb",
  rx = f.forwardRef((e, t) => {
    const { forceMount: n, ...r } = e,
      o = tx(Pl, e.__scopeScrollArea);
    return l.jsx(Dt, {
      present: n || o.hasThumb,
      children: l.jsx(Uj, { ref: t, ...r }),
    });
  }),
  Uj = f.forwardRef((e, t) => {
    const { __scopeScrollArea: n, style: r, ...o } = e,
      s = Ct(Pl, n),
      i = tx(Pl, n),
      { onThumbPositionChange: a } = i,
      c = te(t, (p) => i.onThumbChange(p)),
      u = f.useRef(void 0),
      d = ua(() => {
        u.current && (u.current(), (u.current = void 0));
      }, 100);
    return (
      f.useEffect(() => {
        const p = s.viewport;
        if (p) {
          const h = () => {
            if ((d(), !u.current)) {
              const x = Vj(p, a);
              ((u.current = x), a());
            }
          };
          return (
            a(),
            p.addEventListener("scroll", h),
            () => p.removeEventListener("scroll", h)
          );
        }
      }, [s.viewport, d, a]),
      l.jsx(H.div, {
        "data-state": i.hasThumb ? "visible" : "hidden",
        ...o,
        ref: c,
        style: {
          width: "var(--radix-scroll-area-thumb-width)",
          height: "var(--radix-scroll-area-thumb-height)",
          ...r,
        },
        onPointerDownCapture: $(e.onPointerDownCapture, (p) => {
          const x = p.target.getBoundingClientRect(),
            S = p.clientX - x.left,
            v = p.clientY - x.top;
          i.onThumbPointerDown({ x: S, y: v });
        }),
        onPointerUp: $(e.onPointerUp, i.onThumbPointerUp),
      })
    );
  });
rx.displayName = Pl;
var of = "ScrollAreaCorner",
  ox = f.forwardRef((e, t) => {
    const n = Ct(of, e.__scopeScrollArea),
      r = !!(n.scrollbarX && n.scrollbarY);
    return n.type !== "scroll" && r ? l.jsx(Bj, { ...e, ref: t }) : null;
  });
ox.displayName = of;
var Bj = f.forwardRef((e, t) => {
  const { __scopeScrollArea: n, ...r } = e,
    o = Ct(of, n),
    [s, i] = f.useState(0),
    [a, c] = f.useState(0),
    u = !!(s && a);
  return (
    zo(o.scrollbarX, () => {
      var p;
      const d = ((p = o.scrollbarX) == null ? void 0 : p.offsetHeight) || 0;
      (o.onCornerHeightChange(d), c(d));
    }),
    zo(o.scrollbarY, () => {
      var p;
      const d = ((p = o.scrollbarY) == null ? void 0 : p.offsetWidth) || 0;
      (o.onCornerWidthChange(d), i(d));
    }),
    u
      ? l.jsx(H.div, {
          ...r,
          ref: t,
          style: {
            width: s,
            height: a,
            position: "absolute",
            right: o.dir === "ltr" ? 0 : void 0,
            left: o.dir === "rtl" ? 0 : void 0,
            bottom: 0,
            ...e.style,
          },
        })
      : null
  );
});
function Tl(e) {
  return e ? parseInt(e, 10) : 0;
}
function sx(e, t) {
  const n = e / t;
  return isNaN(n) ? 0 : n;
}
function ca(e) {
  const t = sx(e.viewport, e.content),
    n = e.scrollbar.paddingStart + e.scrollbar.paddingEnd,
    r = (e.scrollbar.size - n) * t;
  return Math.max(r, 18);
}
function Hj(e, t, n, r = "ltr") {
  const o = ca(n),
    s = o / 2,
    i = t || s,
    a = o - i,
    c = n.scrollbar.paddingStart + i,
    u = n.scrollbar.size - n.scrollbar.paddingEnd - a,
    d = n.content - n.viewport,
    p = r === "ltr" ? [0, d] : [d * -1, 0];
  return ix([c, u], p)(e);
}
function ch(e, t, n = "ltr") {
  const r = ca(t),
    o = t.scrollbar.paddingStart + t.scrollbar.paddingEnd,
    s = t.scrollbar.size - o,
    i = t.content - t.viewport,
    a = s - r,
    c = n === "ltr" ? [0, i] : [i * -1, 0],
    u = Nu(e, c);
  return ix([0, i], [0, a])(u);
}
function ix(e, t) {
  return (n) => {
    if (e[0] === e[1] || t[0] === t[1]) return t[0];
    const r = (t[1] - t[0]) / (e[1] - e[0]);
    return t[0] + r * (n - e[0]);
  };
}
function lx(e, t) {
  return e > 0 && e < t;
}
var Vj = (e, t = () => {}) => {
  let n = { left: e.scrollLeft, top: e.scrollTop },
    r = 0;
  return (
    (function o() {
      const s = { left: e.scrollLeft, top: e.scrollTop },
        i = n.left !== s.left,
        a = n.top !== s.top;
      ((i || a) && t(), (n = s), (r = window.requestAnimationFrame(o)));
    })(),
    () => window.cancelAnimationFrame(r)
  );
};
function ua(e, t) {
  const n = xe(e),
    r = f.useRef(0);
  return (
    f.useEffect(() => () => window.clearTimeout(r.current), []),
    f.useCallback(() => {
      (window.clearTimeout(r.current), (r.current = window.setTimeout(n, t)));
    }, [n, t])
  );
}
function zo(e, t) {
  const n = xe(t);
  Ce(() => {
    let r = 0;
    if (e) {
      const o = new ResizeObserver(() => {
        (cancelAnimationFrame(r), (r = window.requestAnimationFrame(n)));
      });
      return (
        o.observe(e),
        () => {
          (window.cancelAnimationFrame(r), o.unobserve(e));
        }
      );
    }
  }, [e, n]);
}
var ax = Xy,
  Wj = Jy,
  Kj = ox;
const sf = f.forwardRef(({ className: e, children: t, ...n }, r) =>
  l.jsxs(ax, {
    ref: r,
    className: q("relative overflow-hidden", e),
    ...n,
    children: [
      l.jsx(Wj, { className: "h-full w-full rounded-[inherit]", children: t }),
      l.jsx(lf, {}),
      l.jsx(Kj, {}),
    ],
  }),
);
sf.displayName = ax.displayName;
const lf = f.forwardRef(
  ({ className: e, orientation: t = "vertical", ...n }, r) =>
    l.jsx(nf, {
      ref: r,
      orientation: t,
      className: q(
        "flex touch-none select-none transition-colors",
        t === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent p-[1px]",
        t === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        e,
      ),
      ...n,
      children: l.jsx(rx, {
        className: "relative flex-1 rounded-full bg-border",
      }),
    }),
);
lf.displayName = nf.displayName;
var Za = "focusScope.autoFocusOnMount",
  Ja = "focusScope.autoFocusOnUnmount",
  uh = { bubbles: !1, cancelable: !0 },
  Qj = "FocusScope",
  af = f.forwardRef((e, t) => {
    const {
        loop: n = !1,
        trapped: r = !1,
        onMountAutoFocus: o,
        onUnmountAutoFocus: s,
        ...i
      } = e,
      [a, c] = f.useState(null),
      u = xe(o),
      d = xe(s),
      p = f.useRef(null),
      h = te(t, (v) => c(v)),
      x = f.useRef({
        paused: !1,
        pause() {
          this.paused = !0;
        },
        resume() {
          this.paused = !1;
        },
      }).current;
    (f.useEffect(() => {
      if (r) {
        let v = function (y) {
            if (x.paused || !a) return;
            const b = y.target;
            a.contains(b) ? (p.current = b) : Pn(p.current, { select: !0 });
          },
          w = function (y) {
            if (x.paused || !a) return;
            const b = y.relatedTarget;
            b !== null && (a.contains(b) || Pn(p.current, { select: !0 }));
          },
          g = function (y) {
            if (document.activeElement === document.body)
              for (const E of y) E.removedNodes.length > 0 && Pn(a);
          };
        (document.addEventListener("focusin", v),
          document.addEventListener("focusout", w));
        const m = new MutationObserver(g);
        return (
          a && m.observe(a, { childList: !0, subtree: !0 }),
          () => {
            (document.removeEventListener("focusin", v),
              document.removeEventListener("focusout", w),
              m.disconnect());
          }
        );
      }
    }, [r, a, x.paused]),
      f.useEffect(() => {
        if (a) {
          fh.add(x);
          const v = document.activeElement;
          if (!a.contains(v)) {
            const g = new CustomEvent(Za, uh);
            (a.addEventListener(Za, u),
              a.dispatchEvent(g),
              g.defaultPrevented ||
                (Gj(Jj(cx(a)), { select: !0 }),
                document.activeElement === v && Pn(a)));
          }
          return () => {
            (a.removeEventListener(Za, u),
              setTimeout(() => {
                const g = new CustomEvent(Ja, uh);
                (a.addEventListener(Ja, d),
                  a.dispatchEvent(g),
                  g.defaultPrevented || Pn(v ?? document.body, { select: !0 }),
                  a.removeEventListener(Ja, d),
                  fh.remove(x));
              }, 0));
          };
        }
      }, [a, u, d, x]));
    const S = f.useCallback(
      (v) => {
        if ((!n && !r) || x.paused) return;
        const w = v.key === "Tab" && !v.altKey && !v.ctrlKey && !v.metaKey,
          g = document.activeElement;
        if (w && g) {
          const m = v.currentTarget,
            [y, b] = Yj(m);
          y && b
            ? !v.shiftKey && g === b
              ? (v.preventDefault(), n && Pn(y, { select: !0 }))
              : v.shiftKey &&
                g === y &&
                (v.preventDefault(), n && Pn(b, { select: !0 }))
            : g === m && v.preventDefault();
        }
      },
      [n, r, x.paused],
    );
    return l.jsx(H.div, { tabIndex: -1, ...i, ref: h, onKeyDown: S });
  });
af.displayName = Qj;
function Gj(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const r of e)
    if ((Pn(r, { select: t }), document.activeElement !== n)) return;
}
function Yj(e) {
  const t = cx(e),
    n = dh(t, e),
    r = dh(t.reverse(), e);
  return [n, r];
}
function cx(e) {
  const t = [],
    n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (r) => {
        const o = r.tagName === "INPUT" && r.type === "hidden";
        return r.disabled || r.hidden || o
          ? NodeFilter.FILTER_SKIP
          : r.tabIndex >= 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
      },
    });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function dh(e, t) {
  for (const n of e) if (!qj(n, { upTo: t })) return n;
}
function qj(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function Xj(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function Pn(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    (e.focus({ preventScroll: !0 }), e !== n && Xj(e) && t && e.select());
  }
}
var fh = Zj();
function Zj() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      (t !== n && (n == null || n.pause()), (e = ph(e, t)), e.unshift(t));
    },
    remove(t) {
      var n;
      ((e = ph(e, t)), (n = e[0]) == null || n.resume());
    },
  };
}
function ph(e, t) {
  const n = [...e],
    r = n.indexOf(t);
  return (r !== -1 && n.splice(r, 1), n);
}
function Jj(e) {
  return e.filter((t) => t.tagName !== "A");
}
var ec = 0;
function ux() {
  f.useEffect(() => {
    const e = document.querySelectorAll("[data-radix-focus-guard]");
    return (
      document.body.insertAdjacentElement("afterbegin", e[0] ?? hh()),
      document.body.insertAdjacentElement("beforeend", e[1] ?? hh()),
      ec++,
      () => {
        (ec === 1 &&
          document
            .querySelectorAll("[data-radix-focus-guard]")
            .forEach((t) => t.remove()),
          ec--);
      }
    );
  }, []);
}
function hh() {
  const e = document.createElement("span");
  return (
    e.setAttribute("data-radix-focus-guard", ""),
    (e.tabIndex = 0),
    (e.style.outline = "none"),
    (e.style.opacity = "0"),
    (e.style.position = "fixed"),
    (e.style.pointerEvents = "none"),
    e
  );
}
var Gt = function () {
  return (
    (Gt =
      Object.assign ||
      function (t) {
        for (var n, r = 1, o = arguments.length; r < o; r++) {
          n = arguments[r];
          for (var s in n)
            Object.prototype.hasOwnProperty.call(n, s) && (t[s] = n[s]);
        }
        return t;
      }),
    Gt.apply(this, arguments)
  );
};
function dx(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) &&
      t.indexOf(r) < 0 &&
      (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, r[o]) &&
        (n[r[o]] = e[r[o]]);
  return n;
}
function ek(e, t, n) {
  if (n || arguments.length === 2)
    for (var r = 0, o = t.length, s; r < o; r++)
      (s || !(r in t)) &&
        (s || (s = Array.prototype.slice.call(t, 0, r)), (s[r] = t[r]));
  return e.concat(s || Array.prototype.slice.call(t));
}
var Yi = "right-scroll-bar-position",
  qi = "width-before-scroll-bar",
  tk = "with-scroll-bars-hidden",
  nk = "--removed-body-scroll-bar-size";
function tc(e, t) {
  return (typeof e == "function" ? e(t) : e && (e.current = t), e);
}
function rk(e, t) {
  var n = f.useState(function () {
    return {
      value: e,
      callback: t,
      facade: {
        get current() {
          return n.value;
        },
        set current(r) {
          var o = n.value;
          o !== r && ((n.value = r), n.callback(r, o));
        },
      },
    };
  })[0];
  return ((n.callback = t), n.facade);
}
var ok = typeof window < "u" ? f.useLayoutEffect : f.useEffect,
  mh = new WeakMap();
function sk(e, t) {
  var n = rk(null, function (r) {
    return e.forEach(function (o) {
      return tc(o, r);
    });
  });
  return (
    ok(
      function () {
        var r = mh.get(n);
        if (r) {
          var o = new Set(r),
            s = new Set(e),
            i = n.current;
          (o.forEach(function (a) {
            s.has(a) || tc(a, null);
          }),
            s.forEach(function (a) {
              o.has(a) || tc(a, i);
            }));
        }
        mh.set(n, e);
      },
      [e],
    ),
    n
  );
}
function ik(e) {
  return e;
}
function lk(e, t) {
  t === void 0 && (t = ik);
  var n = [],
    r = !1,
    o = {
      read: function () {
        if (r)
          throw new Error(
            "Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.",
          );
        return n.length ? n[n.length - 1] : e;
      },
      useMedium: function (s) {
        var i = t(s, r);
        return (
          n.push(i),
          function () {
            n = n.filter(function (a) {
              return a !== i;
            });
          }
        );
      },
      assignSyncMedium: function (s) {
        for (r = !0; n.length; ) {
          var i = n;
          ((n = []), i.forEach(s));
        }
        n = {
          push: function (a) {
            return s(a);
          },
          filter: function () {
            return n;
          },
        };
      },
      assignMedium: function (s) {
        r = !0;
        var i = [];
        if (n.length) {
          var a = n;
          ((n = []), a.forEach(s), (i = n));
        }
        var c = function () {
            var d = i;
            ((i = []), d.forEach(s));
          },
          u = function () {
            return Promise.resolve().then(c);
          };
        (u(),
          (n = {
            push: function (d) {
              (i.push(d), u());
            },
            filter: function (d) {
              return ((i = i.filter(d)), n);
            },
          }));
      },
    };
  return o;
}
function ak(e) {
  e === void 0 && (e = {});
  var t = lk(null);
  return ((t.options = Gt({ async: !0, ssr: !1 }, e)), t);
}
var fx = function (e) {
  var t = e.sideCar,
    n = dx(e, ["sideCar"]);
  if (!t)
    throw new Error(
      "Sidecar: please provide `sideCar` property to import the right car",
    );
  var r = t.read();
  if (!r) throw new Error("Sidecar medium not found");
  return f.createElement(r, Gt({}, n));
};
fx.isSideCarExport = !0;
function ck(e, t) {
  return (e.useMedium(t), fx);
}
var px = ak(),
  nc = function () {},
  da = f.forwardRef(function (e, t) {
    var n = f.useRef(null),
      r = f.useState({
        onScrollCapture: nc,
        onWheelCapture: nc,
        onTouchMoveCapture: nc,
      }),
      o = r[0],
      s = r[1],
      i = e.forwardProps,
      a = e.children,
      c = e.className,
      u = e.removeScrollBar,
      d = e.enabled,
      p = e.shards,
      h = e.sideCar,
      x = e.noIsolation,
      S = e.inert,
      v = e.allowPinchZoom,
      w = e.as,
      g = w === void 0 ? "div" : w,
      m = e.gapMode,
      y = dx(e, [
        "forwardProps",
        "children",
        "className",
        "removeScrollBar",
        "enabled",
        "shards",
        "sideCar",
        "noIsolation",
        "inert",
        "allowPinchZoom",
        "as",
        "gapMode",
      ]),
      b = h,
      E = sk([n, t]),
      k = Gt(Gt({}, y), o);
    return f.createElement(
      f.Fragment,
      null,
      d &&
        f.createElement(b, {
          sideCar: px,
          removeScrollBar: u,
          shards: p,
          noIsolation: x,
          inert: S,
          setCallbacks: s,
          allowPinchZoom: !!v,
          lockRef: n,
          gapMode: m,
        }),
      i
        ? f.cloneElement(f.Children.only(a), Gt(Gt({}, k), { ref: E }))
        : f.createElement(g, Gt({}, k, { className: c, ref: E }), a),
    );
  });
da.defaultProps = { enabled: !0, removeScrollBar: !0, inert: !1 };
da.classNames = { fullWidth: qi, zeroRight: Yi };
var uk = function () {
  if (typeof __webpack_nonce__ < "u") return __webpack_nonce__;
};
function dk() {
  if (!document) return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = uk();
  return (t && e.setAttribute("nonce", t), e);
}
function fk(e, t) {
  e.styleSheet
    ? (e.styleSheet.cssText = t)
    : e.appendChild(document.createTextNode(t));
}
function pk(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var hk = function () {
    var e = 0,
      t = null;
    return {
      add: function (n) {
        (e == 0 && (t = dk()) && (fk(t, n), pk(t)), e++);
      },
      remove: function () {
        (e--,
          !e && t && (t.parentNode && t.parentNode.removeChild(t), (t = null)));
      },
    };
  },
  mk = function () {
    var e = hk();
    return function (t, n) {
      f.useEffect(
        function () {
          return (
            e.add(t),
            function () {
              e.remove();
            }
          );
        },
        [t && n],
      );
    };
  },
  hx = function () {
    var e = mk(),
      t = function (n) {
        var r = n.styles,
          o = n.dynamic;
        return (e(r, o), null);
      };
    return t;
  },
  gk = { left: 0, top: 0, right: 0, gap: 0 },
  rc = function (e) {
    return parseInt(e || "", 10) || 0;
  },
  vk = function (e) {
    var t = window.getComputedStyle(document.body),
      n = t[e === "padding" ? "paddingLeft" : "marginLeft"],
      r = t[e === "padding" ? "paddingTop" : "marginTop"],
      o = t[e === "padding" ? "paddingRight" : "marginRight"];
    return [rc(n), rc(r), rc(o)];
  },
  yk = function (e) {
    if ((e === void 0 && (e = "margin"), typeof window > "u")) return gk;
    var t = vk(e),
      n = document.documentElement.clientWidth,
      r = window.innerWidth;
    return {
      left: t[0],
      top: t[1],
      right: t[2],
      gap: Math.max(0, r - n + t[2] - t[0]),
    };
  },
  xk = hx(),
  fo = "data-scroll-locked",
  wk = function (e, t, n, r) {
    var o = e.left,
      s = e.top,
      i = e.right,
      a = e.gap;
    return (
      n === void 0 && (n = "margin"),
      `
  .`
        .concat(
          tk,
          ` {
   overflow: hidden `,
        )
        .concat(
          r,
          `;
   padding-right: `,
        )
        .concat(a, "px ")
        .concat(
          r,
          `;
  }
  body[`,
        )
        .concat(
          fo,
          `] {
    overflow: hidden `,
        )
        .concat(
          r,
          `;
    overscroll-behavior: contain;
    `,
        )
        .concat(
          [
            t && "position: relative ".concat(r, ";"),
            n === "margin" &&
              `
    padding-left: `
                .concat(
                  o,
                  `px;
    padding-top: `,
                )
                .concat(
                  s,
                  `px;
    padding-right: `,
                )
                .concat(
                  i,
                  `px;
    margin-left:0;
    margin-top:0;
    margin-right: `,
                )
                .concat(a, "px ")
                .concat(
                  r,
                  `;
    `,
                ),
            n === "padding" &&
              "padding-right: ".concat(a, "px ").concat(r, ";"),
          ]
            .filter(Boolean)
            .join(""),
          `
  }
  
  .`,
        )
        .concat(
          Yi,
          ` {
    right: `,
        )
        .concat(a, "px ")
        .concat(
          r,
          `;
  }
  
  .`,
        )
        .concat(
          qi,
          ` {
    margin-right: `,
        )
        .concat(a, "px ")
        .concat(
          r,
          `;
  }
  
  .`,
        )
        .concat(Yi, " .")
        .concat(
          Yi,
          ` {
    right: 0 `,
        )
        .concat(
          r,
          `;
  }
  
  .`,
        )
        .concat(qi, " .")
        .concat(
          qi,
          ` {
    margin-right: 0 `,
        )
        .concat(
          r,
          `;
  }
  
  body[`,
        )
        .concat(
          fo,
          `] {
    `,
        )
        .concat(nk, ": ")
        .concat(
          a,
          `px;
  }
`,
        )
    );
  },
  gh = function () {
    var e = parseInt(document.body.getAttribute(fo) || "0", 10);
    return isFinite(e) ? e : 0;
  },
  Sk = function () {
    f.useEffect(function () {
      return (
        document.body.setAttribute(fo, (gh() + 1).toString()),
        function () {
          var e = gh() - 1;
          e <= 0
            ? document.body.removeAttribute(fo)
            : document.body.setAttribute(fo, e.toString());
        }
      );
    }, []);
  },
  bk = function (e) {
    var t = e.noRelative,
      n = e.noImportant,
      r = e.gapMode,
      o = r === void 0 ? "margin" : r;
    Sk();
    var s = f.useMemo(
      function () {
        return yk(o);
      },
      [o],
    );
    return f.createElement(xk, { styles: wk(s, !t, o, n ? "" : "!important") });
  },
  Eu = !1;
if (typeof window < "u")
  try {
    var Pi = Object.defineProperty({}, "passive", {
      get: function () {
        return ((Eu = !0), !0);
      },
    });
    (window.addEventListener("test", Pi, Pi),
      window.removeEventListener("test", Pi, Pi));
  } catch {
    Eu = !1;
  }
var Ur = Eu ? { passive: !1 } : !1,
  Ck = function (e) {
    return e.tagName === "TEXTAREA";
  },
  mx = function (e, t) {
    if (!(e instanceof Element)) return !1;
    var n = window.getComputedStyle(e);
    return (
      n[t] !== "hidden" &&
      !(n.overflowY === n.overflowX && !Ck(e) && n[t] === "visible")
    );
  },
  Nk = function (e) {
    return mx(e, "overflowY");
  },
  Ek = function (e) {
    return mx(e, "overflowX");
  },
  vh = function (e, t) {
    var n = t.ownerDocument,
      r = t;
    do {
      typeof ShadowRoot < "u" && r instanceof ShadowRoot && (r = r.host);
      var o = gx(e, r);
      if (o) {
        var s = vx(e, r),
          i = s[1],
          a = s[2];
        if (i > a) return !0;
      }
      r = r.parentNode;
    } while (r && r !== n.body);
    return !1;
  },
  jk = function (e) {
    var t = e.scrollTop,
      n = e.scrollHeight,
      r = e.clientHeight;
    return [t, n, r];
  },
  kk = function (e) {
    var t = e.scrollLeft,
      n = e.scrollWidth,
      r = e.clientWidth;
    return [t, n, r];
  },
  gx = function (e, t) {
    return e === "v" ? Nk(t) : Ek(t);
  },
  vx = function (e, t) {
    return e === "v" ? jk(t) : kk(t);
  },
  Pk = function (e, t) {
    return e === "h" && t === "rtl" ? -1 : 1;
  },
  Tk = function (e, t, n, r, o) {
    var s = Pk(e, window.getComputedStyle(t).direction),
      i = s * r,
      a = n.target,
      c = t.contains(a),
      u = !1,
      d = i > 0,
      p = 0,
      h = 0;
    do {
      var x = vx(e, a),
        S = x[0],
        v = x[1],
        w = x[2],
        g = v - w - s * S;
      ((S || g) && gx(e, a) && ((p += g), (h += S)),
        a instanceof ShadowRoot ? (a = a.host) : (a = a.parentNode));
    } while ((!c && a !== document.body) || (c && (t.contains(a) || t === a)));
    return (
      ((d && (Math.abs(p) < 1 || !o)) || (!d && (Math.abs(h) < 1 || !o))) &&
        (u = !0),
      u
    );
  },
  Ti = function (e) {
    return "changedTouches" in e
      ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
      : [0, 0];
  },
  yh = function (e) {
    return [e.deltaX, e.deltaY];
  },
  xh = function (e) {
    return e && "current" in e ? e.current : e;
  },
  Rk = function (e, t) {
    return e[0] === t[0] && e[1] === t[1];
  },
  Ak = function (e) {
    return `
  .block-interactivity-`
      .concat(
        e,
        ` {pointer-events: none;}
  .allow-interactivity-`,
      )
      .concat(
        e,
        ` {pointer-events: all;}
`,
      );
  },
  _k = 0,
  Br = [];
function Ok(e) {
  var t = f.useRef([]),
    n = f.useRef([0, 0]),
    r = f.useRef(),
    o = f.useState(_k++)[0],
    s = f.useState(hx)[0],
    i = f.useRef(e);
  (f.useEffect(
    function () {
      i.current = e;
    },
    [e],
  ),
    f.useEffect(
      function () {
        if (e.inert) {
          document.body.classList.add("block-interactivity-".concat(o));
          var v = ek([e.lockRef.current], (e.shards || []).map(xh), !0).filter(
            Boolean,
          );
          return (
            v.forEach(function (w) {
              return w.classList.add("allow-interactivity-".concat(o));
            }),
            function () {
              (document.body.classList.remove("block-interactivity-".concat(o)),
                v.forEach(function (w) {
                  return w.classList.remove("allow-interactivity-".concat(o));
                }));
            }
          );
        }
      },
      [e.inert, e.lockRef.current, e.shards],
    ));
  var a = f.useCallback(function (v, w) {
      if (
        ("touches" in v && v.touches.length === 2) ||
        (v.type === "wheel" && v.ctrlKey)
      )
        return !i.current.allowPinchZoom;
      var g = Ti(v),
        m = n.current,
        y = "deltaX" in v ? v.deltaX : m[0] - g[0],
        b = "deltaY" in v ? v.deltaY : m[1] - g[1],
        E,
        k = v.target,
        N = Math.abs(y) > Math.abs(b) ? "h" : "v";
      if ("touches" in v && N === "h" && k.type === "range") return !1;
      var j = vh(N, k);
      if (!j) return !0;
      if ((j ? (E = N) : ((E = N === "v" ? "h" : "v"), (j = vh(N, k))), !j))
        return !1;
      if (
        (!r.current && "changedTouches" in v && (y || b) && (r.current = E), !E)
      )
        return !0;
      var P = r.current || E;
      return Tk(P, w, v, P === "h" ? y : b, !0);
    }, []),
    c = f.useCallback(function (v) {
      var w = v;
      if (!(!Br.length || Br[Br.length - 1] !== s)) {
        var g = "deltaY" in w ? yh(w) : Ti(w),
          m = t.current.filter(function (E) {
            return (
              E.name === w.type &&
              (E.target === w.target || w.target === E.shadowParent) &&
              Rk(E.delta, g)
            );
          })[0];
        if (m && m.should) {
          w.cancelable && w.preventDefault();
          return;
        }
        if (!m) {
          var y = (i.current.shards || [])
              .map(xh)
              .filter(Boolean)
              .filter(function (E) {
                return E.contains(w.target);
              }),
            b = y.length > 0 ? a(w, y[0]) : !i.current.noIsolation;
          b && w.cancelable && w.preventDefault();
        }
      }
    }, []),
    u = f.useCallback(function (v, w, g, m) {
      var y = { name: v, delta: w, target: g, should: m, shadowParent: Ik(g) };
      (t.current.push(y),
        setTimeout(function () {
          t.current = t.current.filter(function (b) {
            return b !== y;
          });
        }, 1));
    }, []),
    d = f.useCallback(function (v) {
      ((n.current = Ti(v)), (r.current = void 0));
    }, []),
    p = f.useCallback(function (v) {
      u(v.type, yh(v), v.target, a(v, e.lockRef.current));
    }, []),
    h = f.useCallback(function (v) {
      u(v.type, Ti(v), v.target, a(v, e.lockRef.current));
    }, []);
  f.useEffect(function () {
    return (
      Br.push(s),
      e.setCallbacks({
        onScrollCapture: p,
        onWheelCapture: p,
        onTouchMoveCapture: h,
      }),
      document.addEventListener("wheel", c, Ur),
      document.addEventListener("touchmove", c, Ur),
      document.addEventListener("touchstart", d, Ur),
      function () {
        ((Br = Br.filter(function (v) {
          return v !== s;
        })),
          document.removeEventListener("wheel", c, Ur),
          document.removeEventListener("touchmove", c, Ur),
          document.removeEventListener("touchstart", d, Ur));
      }
    );
  }, []);
  var x = e.removeScrollBar,
    S = e.inert;
  return f.createElement(
    f.Fragment,
    null,
    S ? f.createElement(s, { styles: Ak(o) }) : null,
    x ? f.createElement(bk, { gapMode: e.gapMode }) : null,
  );
}
function Ik(e) {
  for (var t = null; e !== null; )
    (e instanceof ShadowRoot && ((t = e.host), (e = e.host)),
      (e = e.parentNode));
  return t;
}
const Mk = ck(px, Ok);
var cf = f.forwardRef(function (e, t) {
  return f.createElement(da, Gt({}, e, { ref: t, sideCar: Mk }));
});
cf.classNames = da.classNames;
var Lk = function (e) {
    if (typeof document > "u") return null;
    var t = Array.isArray(e) ? e[0] : e;
    return t.ownerDocument.body;
  },
  Hr = new WeakMap(),
  Ri = new WeakMap(),
  Ai = {},
  oc = 0,
  yx = function (e) {
    return e && (e.host || yx(e.parentNode));
  },
  Dk = function (e, t) {
    return t
      .map(function (n) {
        if (e.contains(n)) return n;
        var r = yx(n);
        return r && e.contains(r)
          ? r
          : (console.error(
              "aria-hidden",
              n,
              "in not contained inside",
              e,
              ". Doing nothing",
            ),
            null);
      })
      .filter(function (n) {
        return !!n;
      });
  },
  Fk = function (e, t, n, r) {
    var o = Dk(t, Array.isArray(e) ? e : [e]);
    Ai[n] || (Ai[n] = new WeakMap());
    var s = Ai[n],
      i = [],
      a = new Set(),
      c = new Set(o),
      u = function (p) {
        !p || a.has(p) || (a.add(p), u(p.parentNode));
      };
    o.forEach(u);
    var d = function (p) {
      !p ||
        c.has(p) ||
        Array.prototype.forEach.call(p.children, function (h) {
          if (a.has(h)) d(h);
          else
            try {
              var x = h.getAttribute(r),
                S = x !== null && x !== "false",
                v = (Hr.get(h) || 0) + 1,
                w = (s.get(h) || 0) + 1;
              (Hr.set(h, v),
                s.set(h, w),
                i.push(h),
                v === 1 && S && Ri.set(h, !0),
                w === 1 && h.setAttribute(n, "true"),
                S || h.setAttribute(r, "true"));
            } catch (g) {
              console.error("aria-hidden: cannot operate on ", h, g);
            }
        });
    };
    return (
      d(t),
      a.clear(),
      oc++,
      function () {
        (i.forEach(function (p) {
          var h = Hr.get(p) - 1,
            x = s.get(p) - 1;
          (Hr.set(p, h),
            s.set(p, x),
            h || (Ri.has(p) || p.removeAttribute(r), Ri.delete(p)),
            x || p.removeAttribute(n));
        }),
          oc--,
          oc ||
            ((Hr = new WeakMap()),
            (Hr = new WeakMap()),
            (Ri = new WeakMap()),
            (Ai = {})));
      }
    );
  },
  xx = function (e, t, n) {
    n === void 0 && (n = "data-aria-hidden");
    var r = Array.from(Array.isArray(e) ? e : [e]),
      o = Lk(e);
    return o
      ? (r.push.apply(r, Array.from(o.querySelectorAll("[aria-live]"))),
        Fk(r, o, n, "aria-hidden"))
      : function () {
          return null;
        };
  },
  uf = "Dialog",
  [wx, VP] = en(uf),
  [zk, Ft] = wx(uf),
  Sx = (e) => {
    const {
        __scopeDialog: t,
        children: n,
        open: r,
        defaultOpen: o,
        onOpenChange: s,
        modal: i = !0,
      } = e,
      a = f.useRef(null),
      c = f.useRef(null),
      [u = !1, d] = Lo({ prop: r, defaultProp: o, onChange: s });
    return l.jsx(zk, {
      scope: t,
      triggerRef: a,
      contentRef: c,
      contentId: Zn(),
      titleId: Zn(),
      descriptionId: Zn(),
      open: u,
      onOpenChange: d,
      onOpenToggle: f.useCallback(() => d((p) => !p), [d]),
      modal: i,
      children: n,
    });
  };
Sx.displayName = uf;
var bx = "DialogTrigger",
  $k = f.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = Ft(bx, n),
      s = te(t, o.triggerRef);
    return l.jsx(H.button, {
      type: "button",
      "aria-haspopup": "dialog",
      "aria-expanded": o.open,
      "aria-controls": o.contentId,
      "data-state": pf(o.open),
      ...r,
      ref: s,
      onClick: $(e.onClick, o.onOpenToggle),
    });
  });
$k.displayName = bx;
var df = "DialogPortal",
  [Uk, Cx] = wx(df, { forceMount: void 0 }),
  Nx = (e) => {
    const { __scopeDialog: t, forceMount: n, children: r, container: o } = e,
      s = Ft(df, t);
    return l.jsx(Uk, {
      scope: t,
      forceMount: n,
      children: f.Children.map(r, (i) =>
        l.jsx(Dt, {
          present: n || s.open,
          children: l.jsx(Jl, { asChild: !0, container: o, children: i }),
        }),
      ),
    });
  };
Nx.displayName = df;
var Rl = "DialogOverlay",
  Ex = f.forwardRef((e, t) => {
    const n = Cx(Rl, e.__scopeDialog),
      { forceMount: r = n.forceMount, ...o } = e,
      s = Ft(Rl, e.__scopeDialog);
    return s.modal
      ? l.jsx(Dt, {
          present: r || s.open,
          children: l.jsx(Hk, { ...o, ref: t }),
        })
      : null;
  });
Ex.displayName = Rl;
var Bk = Mo("DialogOverlay.RemoveScroll"),
  Hk = f.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = Ft(Rl, n);
    return l.jsx(cf, {
      as: Bk,
      allowPinchZoom: !0,
      shards: [o.contentRef],
      children: l.jsx(H.div, {
        "data-state": pf(o.open),
        ...r,
        ref: t,
        style: { pointerEvents: "auto", ...r.style },
      }),
    });
  }),
  Mr = "DialogContent",
  jx = f.forwardRef((e, t) => {
    const n = Cx(Mr, e.__scopeDialog),
      { forceMount: r = n.forceMount, ...o } = e,
      s = Ft(Mr, e.__scopeDialog);
    return l.jsx(Dt, {
      present: r || s.open,
      children: s.modal
        ? l.jsx(Vk, { ...o, ref: t })
        : l.jsx(Wk, { ...o, ref: t }),
    });
  });
jx.displayName = Mr;
var Vk = f.forwardRef((e, t) => {
    const n = Ft(Mr, e.__scopeDialog),
      r = f.useRef(null),
      o = te(t, n.contentRef, r);
    return (
      f.useEffect(() => {
        const s = r.current;
        if (s) return xx(s);
      }, []),
      l.jsx(kx, {
        ...e,
        ref: o,
        trapFocus: n.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: $(e.onCloseAutoFocus, (s) => {
          var i;
          (s.preventDefault(), (i = n.triggerRef.current) == null || i.focus());
        }),
        onPointerDownOutside: $(e.onPointerDownOutside, (s) => {
          const i = s.detail.originalEvent,
            a = i.button === 0 && i.ctrlKey === !0;
          (i.button === 2 || a) && s.preventDefault();
        }),
        onFocusOutside: $(e.onFocusOutside, (s) => s.preventDefault()),
      })
    );
  }),
  Wk = f.forwardRef((e, t) => {
    const n = Ft(Mr, e.__scopeDialog),
      r = f.useRef(!1),
      o = f.useRef(!1);
    return l.jsx(kx, {
      ...e,
      ref: t,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      onCloseAutoFocus: (s) => {
        var i, a;
        ((i = e.onCloseAutoFocus) == null || i.call(e, s),
          s.defaultPrevented ||
            (r.current || (a = n.triggerRef.current) == null || a.focus(),
            s.preventDefault()),
          (r.current = !1),
          (o.current = !1));
      },
      onInteractOutside: (s) => {
        var c, u;
        ((c = e.onInteractOutside) == null || c.call(e, s),
          s.defaultPrevented ||
            ((r.current = !0),
            s.detail.originalEvent.type === "pointerdown" && (o.current = !0)));
        const i = s.target;
        (((u = n.triggerRef.current) == null ? void 0 : u.contains(i)) &&
          s.preventDefault(),
          s.detail.originalEvent.type === "focusin" &&
            o.current &&
            s.preventDefault());
      },
    });
  }),
  kx = f.forwardRef((e, t) => {
    const {
        __scopeDialog: n,
        trapFocus: r,
        onOpenAutoFocus: o,
        onCloseAutoFocus: s,
        ...i
      } = e,
      a = Ft(Mr, n),
      c = f.useRef(null),
      u = te(t, c);
    return (
      ux(),
      l.jsxs(l.Fragment, {
        children: [
          l.jsx(af, {
            asChild: !0,
            loop: !0,
            trapped: r,
            onMountAutoFocus: o,
            onUnmountAutoFocus: s,
            children: l.jsx(ei, {
              role: "dialog",
              id: a.contentId,
              "aria-describedby": a.descriptionId,
              "aria-labelledby": a.titleId,
              "data-state": pf(a.open),
              ...i,
              ref: u,
              onDismiss: () => a.onOpenChange(!1),
            }),
          }),
          l.jsxs(l.Fragment, {
            children: [
              l.jsx(Kk, { titleId: a.titleId }),
              l.jsx(Gk, { contentRef: c, descriptionId: a.descriptionId }),
            ],
          }),
        ],
      })
    );
  }),
  ff = "DialogTitle",
  Px = f.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = Ft(ff, n);
    return l.jsx(H.h2, { id: o.titleId, ...r, ref: t });
  });
Px.displayName = ff;
var Tx = "DialogDescription",
  Rx = f.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = Ft(Tx, n);
    return l.jsx(H.p, { id: o.descriptionId, ...r, ref: t });
  });
Rx.displayName = Tx;
var Ax = "DialogClose",
  _x = f.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = Ft(Ax, n);
    return l.jsx(H.button, {
      type: "button",
      ...r,
      ref: t,
      onClick: $(e.onClick, () => o.onOpenChange(!1)),
    });
  });
_x.displayName = Ax;
function pf(e) {
  return e ? "open" : "closed";
}
var Ox = "DialogTitleWarning",
  [WP, Ix] = Jb(Ox, { contentName: Mr, titleName: ff, docsSlug: "dialog" }),
  Kk = ({ titleId: e }) => {
    const t = Ix(Ox),
      n = `\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;
    return (
      f.useEffect(() => {
        e && (document.getElementById(e) || console.error(n));
      }, [n, e]),
      null
    );
  },
  Qk = "DialogDescriptionWarning",
  Gk = ({ contentRef: e, descriptionId: t }) => {
    const r = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${Ix(Qk).contentName}}.`;
    return (
      f.useEffect(() => {
        var s;
        const o =
          (s = e.current) == null ? void 0 : s.getAttribute("aria-describedby");
        t && o && (document.getElementById(t) || console.warn(r));
      }, [r, e, t]),
      null
    );
  },
  Yk = Sx,
  qk = Nx,
  Mx = Ex,
  Lx = jx,
  Dx = Px,
  Fx = Rx,
  Xk = _x;
const Zk = Yk,
  Jk = qk,
  zx = f.forwardRef(({ className: e, ...t }, n) =>
    l.jsx(Mx, {
      ref: n,
      className: q(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        e,
      ),
      ...t,
    }),
  );
zx.displayName = Mx.displayName;
const $x = f.forwardRef(({ className: e, children: t, ...n }, r) =>
  l.jsxs(Jk, {
    children: [
      l.jsx(zx, {}),
      l.jsxs(Lx, {
        ref: r,
        className: q(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          e,
        ),
        ...n,
        children: [
          t,
          l.jsxs(Xk, {
            className:
              "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
            children: [
              l.jsx(ni, { className: "h-4 w-4" }),
              l.jsx("span", { className: "sr-only", children: "Close" }),
            ],
          }),
        ],
      }),
    ],
  }),
);
$x.displayName = Lx.displayName;
const Ux = ({ className: e, ...t }) =>
  l.jsx("div", {
    className: q("flex flex-col space-y-1.5 text-center sm:text-left", e),
    ...t,
  });
Ux.displayName = "DialogHeader";
const Bx = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx(Dx, {
    ref: n,
    className: q("text-lg font-semibold leading-none tracking-tight", e),
    ...t,
  }),
);
Bx.displayName = Dx.displayName;
const e2 = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx(Fx, { ref: n, className: q("text-sm text-muted-foreground", e), ...t }),
);
e2.displayName = Fx.displayName;
const t2 = {
  PhysicsWallah: "bg-blue-600",
  Unacademy: "bg-green-600",
  Byjus: "bg-purple-600",
  MadeEasy: "bg-red-600",
  AceAcademy: "bg-orange-600",
  YouTube: "bg-red-500",
  Other: "bg-gray-600",
};
function jn({ label: e, values: t, highlight: n, format: r }) {
  const o = t.map((i) =>
      typeof i == "number" ? i : parseFloat(String(i) || "0"),
    ),
    s =
      n === "lowest"
        ? o.indexOf(Math.min(...o.filter((i) => !isNaN(i) && i > 0)))
        : n === "highest"
          ? o.indexOf(Math.max(...o.filter((i) => !isNaN(i))))
          : -1;
  return l.jsxs("tr", {
    className: "border-b",
    children: [
      l.jsx("td", {
        className:
          "py-3 px-4 font-medium text-sm text-muted-foreground bg-muted/30 sticky left-0",
        children: e,
      }),
      t.map((i, a) =>
        l.jsx(
          "td",
          {
            className: `py-3 px-4 text-center min-w-[180px] ${a === s ? "bg-green-50 dark:bg-green-950" : ""}`,
            children:
              i != null
                ? l.jsx("span", {
                    className:
                      a === s
                        ? "font-semibold text-green-700 dark:text-green-300"
                        : "",
                    children: r ? r(i) : String(i),
                  })
                : l.jsx(ZC, {
                    className: "h-4 w-4 mx-auto text-muted-foreground",
                  }),
          },
          a,
        ),
      ),
    ],
  });
}
function n2({ courses: e, isOpen: t, onClose: n, onRemoveCourse: r }) {
  return e.length === 0
    ? null
    : l.jsx(Zk, {
        open: t,
        onOpenChange: (o) => !o && n(),
        children: l.jsxs($x, {
          className: "max-w-6xl max-h-[90vh] overflow-hidden p-0",
          "data-testid": "dialog-compare",
          children: [
            l.jsx(Ux, {
              className: "p-6 pb-0",
              children: l.jsxs(Bx, {
                className: "text-xl",
                children: ["Compare Courses (", e.length, ")"],
              }),
            }),
            l.jsxs(sf, {
              className: "max-h-[calc(90vh-100px)]",
              children: [
                l.jsx("div", {
                  className: "overflow-x-auto",
                  children: l.jsxs("table", {
                    className: "w-full border-collapse",
                    children: [
                      l.jsx("thead", {
                        children: l.jsxs("tr", {
                          className: "border-b",
                          children: [
                            l.jsx("th", {
                              className:
                                "py-4 px-4 text-left font-medium text-sm text-muted-foreground bg-muted/30 sticky left-0 min-w-[120px]",
                              children: "Feature",
                            }),
                            e.map((o) =>
                              l.jsx(
                                "th",
                                {
                                  className: "py-4 px-4 min-w-[180px]",
                                  children: l.jsxs("div", {
                                    className: "space-y-2",
                                    children: [
                                      l.jsxs("div", {
                                        className:
                                          "flex items-center justify-center gap-2",
                                        children: [
                                          l.jsx("div", {
                                            className: `h-6 w-6 rounded ${t2[o.provider]} flex items-center justify-center`,
                                            children: l.jsx("span", {
                                              className:
                                                "text-white text-xs font-bold",
                                              children: o.provider.charAt(0),
                                            }),
                                          }),
                                          l.jsx("span", {
                                            className:
                                              "text-xs text-muted-foreground",
                                            children: o.provider,
                                          }),
                                        ],
                                      }),
                                      l.jsx("p", {
                                        className:
                                          "font-semibold text-sm line-clamp-2",
                                        children: o.name,
                                      }),
                                      l.jsxs(we, {
                                        variant: "ghost",
                                        size: "sm",
                                        className:
                                          "h-7 text-xs text-muted-foreground",
                                        onClick: () => r(o.id),
                                        "data-testid": `button-remove-compare-${o.id}`,
                                        children: [
                                          l.jsx(ni, {
                                            className: "h-3 w-3 mr-1",
                                          }),
                                          "Remove",
                                        ],
                                      }),
                                    ],
                                  }),
                                },
                                o.id,
                              ),
                            ),
                          ],
                        }),
                      }),
                      l.jsxs("tbody", {
                        children: [
                          l.jsx(jn, {
                            label: "Price",
                            values: e.map((o) => o.price),
                            highlight: "lowest",
                            format: (o) =>
                              o === 0
                                ? "Free"
                                : `₹${Number(o).toLocaleString()}`,
                          }),
                          l.jsx(jn, {
                            label: "Duration",
                            values: e.map((o) => o.duration),
                          }),
                          l.jsx(jn, {
                            label: "Mode",
                            values: e.map((o) => o.mode),
                          }),
                          l.jsx(jn, {
                            label: "Language",
                            values: e.map((o) => o.language),
                          }),
                          l.jsx(jn, {
                            label: "Target Year",
                            values: e.map((o) => o.targetYear),
                          }),
                          l.jsx(jn, {
                            label: "Validity",
                            values: e.map((o) => o.validity),
                          }),
                          l.jsx(jn, {
                            label: "Best For",
                            values: e.map((o) => o.bestFor),
                          }),
                          l.jsx(jn, {
                            label: "Rating",
                            values: e.map((o) => o.rating),
                            highlight: "highest",
                            format: (o) =>
                              o ? `${Number(o).toFixed(1)} / 5` : "-",
                          }),
                          l.jsxs("tr", {
                            className: "border-b",
                            children: [
                              l.jsx("td", {
                                className:
                                  "py-3 px-4 font-medium text-sm text-muted-foreground bg-muted/30 sticky left-0",
                                children: "Features",
                              }),
                              e.map((o) =>
                                l.jsx(
                                  "td",
                                  {
                                    className: "py-3 px-4 min-w-[180px]",
                                    children: l.jsx("ul", {
                                      className: "space-y-1",
                                      children: o.features
                                        .slice(0, 5)
                                        .map((s, i) =>
                                          l.jsxs(
                                            "li",
                                            {
                                              className:
                                                "flex items-start gap-1.5 text-xs",
                                              children: [
                                                l.jsx($d, {
                                                  className:
                                                    "h-3 w-3 text-green-600 mt-0.5 shrink-0",
                                                }),
                                                l.jsx("span", { children: s }),
                                              ],
                                            },
                                            i,
                                          ),
                                        ),
                                    }),
                                  },
                                  o.id,
                                ),
                              ),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
                l.jsx(lf, { orientation: "horizontal" }),
              ],
            }),
          ],
        }),
      });
}
function r2({ count: e, onClick: t }) {
  return e === 0
    ? null
    : l.jsxs(we, {
        className: "fixed bottom-20 md:bottom-6 right-6 z-40 shadow-lg gap-2",
        size: "lg",
        onClick: t,
        "data-testid": "button-open-compare",
        children: [
          "Compare",
          l.jsx(_e, {
            variant: "secondary",
            className: "bg-white/20 text-white",
            children: e,
          }),
        ],
      });
}
function po({ filters: e, selectedFilters: t, onToggle: n }) {
  return l.jsx("div", {
    className: "flex flex-wrap gap-2",
    children: e.map((r) => {
      const o = t.includes(r.id);
      return l.jsx(
        _e,
        {
          variant: o ? "default" : "secondary",
          className: "cursor-pointer toggle-elevate",
          onClick: () => n(r.id),
          "data-testid": `filter-chip-${r.id}`,
          children: r.label,
        },
        r.id,
      );
    }),
  });
}
function o2(e) {
  const t = f.useRef({ value: e, previous: e });
  return f.useMemo(
    () => (
      t.current.value !== e &&
        ((t.current.previous = t.current.value), (t.current.value = e)),
      t.current.previous
    ),
    [e],
  );
}
var s2 = [" ", "Enter", "ArrowUp", "ArrowDown"],
  i2 = [" ", "Enter"],
  oi = "Select",
  [fa, pa, l2] = Id(oi),
  [Go, KP] = en(oi, [l2, sa]),
  ha = sa(),
  [a2, lr] = Go(oi),
  [c2, u2] = Go(oi),
  Hx = (e) => {
    const {
        __scopeSelect: t,
        children: n,
        open: r,
        defaultOpen: o,
        onOpenChange: s,
        value: i,
        defaultValue: a,
        onValueChange: c,
        dir: u,
        name: d,
        autoComplete: p,
        disabled: h,
        required: x,
        form: S,
      } = e,
      v = ha(t),
      [w, g] = f.useState(null),
      [m, y] = f.useState(null),
      [b, E] = f.useState(!1),
      k = aa(u),
      [N = !1, j] = Lo({ prop: r, defaultProp: o, onChange: s }),
      [P, R] = Lo({ prop: i, defaultProp: a, onChange: c }),
      M = f.useRef(null),
      I = w ? S || !!w.closest("form") : !0,
      [V, O] = f.useState(new Set()),
      K = Array.from(V)
        .map((F) => F.props.value)
        .join(";");
    return l.jsx(XE, {
      ...v,
      children: l.jsxs(a2, {
        required: x,
        scope: t,
        trigger: w,
        onTriggerChange: g,
        valueNode: m,
        onValueNodeChange: y,
        valueNodeHasChildren: b,
        onValueNodeHasChildrenChange: E,
        contentId: Zn(),
        value: P,
        onValueChange: R,
        open: N,
        onOpenChange: j,
        dir: k,
        triggerPointerDownPosRef: M,
        disabled: h,
        children: [
          l.jsx(fa.Provider, {
            scope: t,
            children: l.jsx(c2, {
              scope: e.__scopeSelect,
              onNativeOptionAdd: f.useCallback((F) => {
                O((Q) => new Set(Q).add(F));
              }, []),
              onNativeOptionRemove: f.useCallback((F) => {
                O((Q) => {
                  const T = new Set(Q);
                  return (T.delete(F), T);
                });
              }, []),
              children: n,
            }),
          }),
          I
            ? l.jsxs(
                h0,
                {
                  "aria-hidden": !0,
                  required: x,
                  tabIndex: -1,
                  name: d,
                  autoComplete: p,
                  value: P,
                  onChange: (F) => R(F.target.value),
                  disabled: h,
                  form: S,
                  children: [
                    P === void 0 ? l.jsx("option", { value: "" }) : null,
                    Array.from(V),
                  ],
                },
                K,
              )
            : null,
        ],
      }),
    });
  };
Hx.displayName = oi;
var Vx = "SelectTrigger",
  Wx = f.forwardRef((e, t) => {
    const { __scopeSelect: n, disabled: r = !1, ...o } = e,
      s = ha(n),
      i = lr(Vx, n),
      a = i.disabled || r,
      c = te(t, i.onTriggerChange),
      u = pa(n),
      d = f.useRef("touch"),
      [p, h, x] = m0((v) => {
        const w = u().filter((y) => !y.disabled),
          g = w.find((y) => y.value === i.value),
          m = g0(w, v, g);
        m !== void 0 && i.onValueChange(m.value);
      }),
      S = (v) => {
        (a || (i.onOpenChange(!0), x()),
          v &&
            (i.triggerPointerDownPosRef.current = {
              x: Math.round(v.pageX),
              y: Math.round(v.pageY),
            }));
      };
    return l.jsx(My, {
      asChild: !0,
      ...s,
      children: l.jsx(H.button, {
        type: "button",
        role: "combobox",
        "aria-controls": i.contentId,
        "aria-expanded": i.open,
        "aria-required": i.required,
        "aria-autocomplete": "none",
        dir: i.dir,
        "data-state": i.open ? "open" : "closed",
        disabled: a,
        "data-disabled": a ? "" : void 0,
        "data-placeholder": p0(i.value) ? "" : void 0,
        ...o,
        ref: c,
        onClick: $(o.onClick, (v) => {
          (v.currentTarget.focus(), d.current !== "mouse" && S(v));
        }),
        onPointerDown: $(o.onPointerDown, (v) => {
          d.current = v.pointerType;
          const w = v.target;
          (w.hasPointerCapture(v.pointerId) &&
            w.releasePointerCapture(v.pointerId),
            v.button === 0 &&
              v.ctrlKey === !1 &&
              v.pointerType === "mouse" &&
              (S(v), v.preventDefault()));
        }),
        onKeyDown: $(o.onKeyDown, (v) => {
          const w = p.current !== "";
          (!(v.ctrlKey || v.altKey || v.metaKey) &&
            v.key.length === 1 &&
            h(v.key),
            !(w && v.key === " ") &&
              s2.includes(v.key) &&
              (S(), v.preventDefault()));
        }),
      }),
    });
  });
Wx.displayName = Vx;
var Kx = "SelectValue",
  Qx = f.forwardRef((e, t) => {
    const {
        __scopeSelect: n,
        className: r,
        style: o,
        children: s,
        placeholder: i = "",
        ...a
      } = e,
      c = lr(Kx, n),
      { onValueNodeHasChildrenChange: u } = c,
      d = s !== void 0,
      p = te(t, c.onValueNodeChange);
    return (
      Ce(() => {
        u(d);
      }, [u, d]),
      l.jsx(H.span, {
        ...a,
        ref: p,
        style: { pointerEvents: "none" },
        children: p0(c.value) ? l.jsx(l.Fragment, { children: i }) : s,
      })
    );
  });
Qx.displayName = Kx;
var d2 = "SelectIcon",
  Gx = f.forwardRef((e, t) => {
    const { __scopeSelect: n, children: r, ...o } = e;
    return l.jsx(H.span, {
      "aria-hidden": !0,
      ...o,
      ref: t,
      children: r || "▼",
    });
  });
Gx.displayName = d2;
var f2 = "SelectPortal",
  Yx = (e) => l.jsx(Jl, { asChild: !0, ...e });
Yx.displayName = f2;
var Lr = "SelectContent",
  qx = f.forwardRef((e, t) => {
    const n = lr(Lr, e.__scopeSelect),
      [r, o] = f.useState();
    if (
      (Ce(() => {
        o(new DocumentFragment());
      }, []),
      !n.open)
    ) {
      const s = r;
      return s
        ? zr.createPortal(
            l.jsx(Xx, {
              scope: e.__scopeSelect,
              children: l.jsx(fa.Slot, {
                scope: e.__scopeSelect,
                children: l.jsx("div", { children: e.children }),
              }),
            }),
            s,
          )
        : null;
    }
    return l.jsx(Zx, { ...e, ref: t });
  });
qx.displayName = Lr;
var Et = 10,
  [Xx, ar] = Go(Lr),
  p2 = "SelectContentImpl",
  h2 = Mo("SelectContent.RemoveScroll"),
  Zx = f.forwardRef((e, t) => {
    const {
        __scopeSelect: n,
        position: r = "item-aligned",
        onCloseAutoFocus: o,
        onEscapeKeyDown: s,
        onPointerDownOutside: i,
        side: a,
        sideOffset: c,
        align: u,
        alignOffset: d,
        arrowPadding: p,
        collisionBoundary: h,
        collisionPadding: x,
        sticky: S,
        hideWhenDetached: v,
        avoidCollisions: w,
        ...g
      } = e,
      m = lr(Lr, n),
      [y, b] = f.useState(null),
      [E, k] = f.useState(null),
      N = te(t, (B) => b(B)),
      [j, P] = f.useState(null),
      [R, M] = f.useState(null),
      I = pa(n),
      [V, O] = f.useState(!1),
      K = f.useRef(!1);
    (f.useEffect(() => {
      if (y) return xx(y);
    }, [y]),
      ux());
    const F = f.useCallback(
        (B) => {
          const [ce, ...Le] = I().map((ie) => ie.ref.current),
            [le] = Le.slice(-1),
            se = document.activeElement;
          for (const ie of B)
            if (
              ie === se ||
              (ie == null || ie.scrollIntoView({ block: "nearest" }),
              ie === ce && E && (E.scrollTop = 0),
              ie === le && E && (E.scrollTop = E.scrollHeight),
              ie == null || ie.focus(),
              document.activeElement !== se)
            )
              return;
        },
        [I, E],
      ),
      Q = f.useCallback(() => F([j, y]), [F, j, y]);
    f.useEffect(() => {
      V && Q();
    }, [V, Q]);
    const { onOpenChange: T, triggerPointerDownPosRef: _ } = m;
    (f.useEffect(() => {
      if (y) {
        let B = { x: 0, y: 0 };
        const ce = (le) => {
            var se, ie;
            B = {
              x: Math.abs(
                Math.round(le.pageX) -
                  (((se = _.current) == null ? void 0 : se.x) ?? 0),
              ),
              y: Math.abs(
                Math.round(le.pageY) -
                  (((ie = _.current) == null ? void 0 : ie.y) ?? 0),
              ),
            };
          },
          Le = (le) => {
            (B.x <= 10 && B.y <= 10
              ? le.preventDefault()
              : y.contains(le.target) || T(!1),
              document.removeEventListener("pointermove", ce),
              (_.current = null));
          };
        return (
          _.current !== null &&
            (document.addEventListener("pointermove", ce),
            document.addEventListener("pointerup", Le, {
              capture: !0,
              once: !0,
            })),
          () => {
            (document.removeEventListener("pointermove", ce),
              document.removeEventListener("pointerup", Le, { capture: !0 }));
          }
        );
      }
    }, [y, T, _]),
      f.useEffect(() => {
        const B = () => T(!1);
        return (
          window.addEventListener("blur", B),
          window.addEventListener("resize", B),
          () => {
            (window.removeEventListener("blur", B),
              window.removeEventListener("resize", B));
          }
        );
      }, [T]));
    const [z, W] = m0((B) => {
        const ce = I().filter((se) => !se.disabled),
          Le = ce.find((se) => se.ref.current === document.activeElement),
          le = g0(ce, B, Le);
        le && setTimeout(() => le.ref.current.focus());
      }),
      oe = f.useCallback(
        (B, ce, Le) => {
          const le = !K.current && !Le;
          ((m.value !== void 0 && m.value === ce) || le) &&
            (P(B), le && (K.current = !0));
        },
        [m.value],
      ),
      Be = f.useCallback(() => (y == null ? void 0 : y.focus()), [y]),
      Ne = f.useCallback(
        (B, ce, Le) => {
          const le = !K.current && !Le;
          ((m.value !== void 0 && m.value === ce) || le) && M(B);
        },
        [m.value],
      ),
      zt = r === "popper" ? ju : Jx,
      He =
        zt === ju
          ? {
              side: a,
              sideOffset: c,
              align: u,
              alignOffset: d,
              arrowPadding: p,
              collisionBoundary: h,
              collisionPadding: x,
              sticky: S,
              hideWhenDetached: v,
              avoidCollisions: w,
            }
          : {};
    return l.jsx(Xx, {
      scope: n,
      content: y,
      viewport: E,
      onViewportChange: k,
      itemRefCallback: oe,
      selectedItem: j,
      onItemLeave: Be,
      itemTextRefCallback: Ne,
      focusSelectedItem: Q,
      selectedItemText: R,
      position: r,
      isPositioned: V,
      searchRef: z,
      children: l.jsx(cf, {
        as: h2,
        allowPinchZoom: !0,
        children: l.jsx(af, {
          asChild: !0,
          trapped: m.open,
          onMountAutoFocus: (B) => {
            B.preventDefault();
          },
          onUnmountAutoFocus: $(o, (B) => {
            var ce;
            ((ce = m.trigger) == null || ce.focus({ preventScroll: !0 }),
              B.preventDefault());
          }),
          children: l.jsx(ei, {
            asChild: !0,
            disableOutsidePointerEvents: !0,
            onEscapeKeyDown: s,
            onPointerDownOutside: i,
            onFocusOutside: (B) => B.preventDefault(),
            onDismiss: () => m.onOpenChange(!1),
            children: l.jsx(zt, {
              role: "listbox",
              id: m.contentId,
              "data-state": m.open ? "open" : "closed",
              dir: m.dir,
              onContextMenu: (B) => B.preventDefault(),
              ...g,
              ...He,
              onPlaced: () => O(!0),
              ref: N,
              style: {
                display: "flex",
                flexDirection: "column",
                outline: "none",
                ...g.style,
              },
              onKeyDown: $(g.onKeyDown, (B) => {
                const ce = B.ctrlKey || B.altKey || B.metaKey;
                if (
                  (B.key === "Tab" && B.preventDefault(),
                  !ce && B.key.length === 1 && W(B.key),
                  ["ArrowUp", "ArrowDown", "Home", "End"].includes(B.key))
                ) {
                  let le = I()
                    .filter((se) => !se.disabled)
                    .map((se) => se.ref.current);
                  if (
                    (["ArrowUp", "End"].includes(B.key) &&
                      (le = le.slice().reverse()),
                    ["ArrowUp", "ArrowDown"].includes(B.key))
                  ) {
                    const se = B.target,
                      ie = le.indexOf(se);
                    le = le.slice(ie + 1);
                  }
                  (setTimeout(() => F(le)), B.preventDefault());
                }
              }),
            }),
          }),
        }),
      }),
    });
  });
Zx.displayName = p2;
var m2 = "SelectItemAlignedPosition",
  Jx = f.forwardRef((e, t) => {
    const { __scopeSelect: n, onPlaced: r, ...o } = e,
      s = lr(Lr, n),
      i = ar(Lr, n),
      [a, c] = f.useState(null),
      [u, d] = f.useState(null),
      p = te(t, (N) => d(N)),
      h = pa(n),
      x = f.useRef(!1),
      S = f.useRef(!0),
      {
        viewport: v,
        selectedItem: w,
        selectedItemText: g,
        focusSelectedItem: m,
      } = i,
      y = f.useCallback(() => {
        if (s.trigger && s.valueNode && a && u && v && w && g) {
          const N = s.trigger.getBoundingClientRect(),
            j = u.getBoundingClientRect(),
            P = s.valueNode.getBoundingClientRect(),
            R = g.getBoundingClientRect();
          if (s.dir !== "rtl") {
            const se = R.left - j.left,
              ie = P.left - se,
              ot = N.left - ie,
              $t = N.width + ot,
              Yo = Math.max($t, j.width),
              qo = window.innerWidth - Et,
              Xo = Nu(ie, [Et, Math.max(Et, qo - Yo)]);
            ((a.style.minWidth = $t + "px"), (a.style.left = Xo + "px"));
          } else {
            const se = j.right - R.right,
              ie = window.innerWidth - P.right - se,
              ot = window.innerWidth - N.right - ie,
              $t = N.width + ot,
              Yo = Math.max($t, j.width),
              qo = window.innerWidth - Et,
              Xo = Nu(ie, [Et, Math.max(Et, qo - Yo)]);
            ((a.style.minWidth = $t + "px"), (a.style.right = Xo + "px"));
          }
          const M = h(),
            I = window.innerHeight - Et * 2,
            V = v.scrollHeight,
            O = window.getComputedStyle(u),
            K = parseInt(O.borderTopWidth, 10),
            F = parseInt(O.paddingTop, 10),
            Q = parseInt(O.borderBottomWidth, 10),
            T = parseInt(O.paddingBottom, 10),
            _ = K + F + V + T + Q,
            z = Math.min(w.offsetHeight * 5, _),
            W = window.getComputedStyle(v),
            oe = parseInt(W.paddingTop, 10),
            Be = parseInt(W.paddingBottom, 10),
            Ne = N.top + N.height / 2 - Et,
            zt = I - Ne,
            He = w.offsetHeight / 2,
            B = w.offsetTop + He,
            ce = K + F + B,
            Le = _ - ce;
          if (ce <= Ne) {
            const se = M.length > 0 && w === M[M.length - 1].ref.current;
            a.style.bottom = "0px";
            const ie = u.clientHeight - v.offsetTop - v.offsetHeight,
              ot = Math.max(zt, He + (se ? Be : 0) + ie + Q),
              $t = ce + ot;
            a.style.height = $t + "px";
          } else {
            const se = M.length > 0 && w === M[0].ref.current;
            a.style.top = "0px";
            const ot = Math.max(Ne, K + v.offsetTop + (se ? oe : 0) + He) + Le;
            ((a.style.height = ot + "px"),
              (v.scrollTop = ce - Ne + v.offsetTop));
          }
          ((a.style.margin = `${Et}px 0`),
            (a.style.minHeight = z + "px"),
            (a.style.maxHeight = I + "px"),
            r == null || r(),
            requestAnimationFrame(() => (x.current = !0)));
        }
      }, [h, s.trigger, s.valueNode, a, u, v, w, g, s.dir, r]);
    Ce(() => y(), [y]);
    const [b, E] = f.useState();
    Ce(() => {
      u && E(window.getComputedStyle(u).zIndex);
    }, [u]);
    const k = f.useCallback(
      (N) => {
        N && S.current === !0 && (y(), m == null || m(), (S.current = !1));
      },
      [y, m],
    );
    return l.jsx(v2, {
      scope: n,
      contentWrapper: a,
      shouldExpandOnScrollRef: x,
      onScrollButtonChange: k,
      children: l.jsx("div", {
        ref: c,
        style: {
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          zIndex: b,
        },
        children: l.jsx(H.div, {
          ...o,
          ref: p,
          style: { boxSizing: "border-box", maxHeight: "100%", ...o.style },
        }),
      }),
    });
  });
Jx.displayName = m2;
var g2 = "SelectPopperPosition",
  ju = f.forwardRef((e, t) => {
    const {
        __scopeSelect: n,
        align: r = "start",
        collisionPadding: o = Et,
        ...s
      } = e,
      i = ha(n);
    return l.jsx(Ly, {
      ...i,
      ...s,
      ref: t,
      align: r,
      collisionPadding: o,
      style: {
        boxSizing: "border-box",
        ...s.style,
        "--radix-select-content-transform-origin":
          "var(--radix-popper-transform-origin)",
        "--radix-select-content-available-width":
          "var(--radix-popper-available-width)",
        "--radix-select-content-available-height":
          "var(--radix-popper-available-height)",
        "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-select-trigger-height": "var(--radix-popper-anchor-height)",
      },
    });
  });
ju.displayName = g2;
var [v2, hf] = Go(Lr, {}),
  ku = "SelectViewport",
  e0 = f.forwardRef((e, t) => {
    const { __scopeSelect: n, nonce: r, ...o } = e,
      s = ar(ku, n),
      i = hf(ku, n),
      a = te(t, s.onViewportChange),
      c = f.useRef(0);
    return l.jsxs(l.Fragment, {
      children: [
        l.jsx("style", {
          dangerouslySetInnerHTML: {
            __html:
              "[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}",
          },
          nonce: r,
        }),
        l.jsx(fa.Slot, {
          scope: n,
          children: l.jsx(H.div, {
            "data-radix-select-viewport": "",
            role: "presentation",
            ...o,
            ref: a,
            style: {
              position: "relative",
              flex: 1,
              overflow: "hidden auto",
              ...o.style,
            },
            onScroll: $(o.onScroll, (u) => {
              const d = u.currentTarget,
                { contentWrapper: p, shouldExpandOnScrollRef: h } = i;
              if (h != null && h.current && p) {
                const x = Math.abs(c.current - d.scrollTop);
                if (x > 0) {
                  const S = window.innerHeight - Et * 2,
                    v = parseFloat(p.style.minHeight),
                    w = parseFloat(p.style.height),
                    g = Math.max(v, w);
                  if (g < S) {
                    const m = g + x,
                      y = Math.min(S, m),
                      b = m - y;
                    ((p.style.height = y + "px"),
                      p.style.bottom === "0px" &&
                        ((d.scrollTop = b > 0 ? b : 0),
                        (p.style.justifyContent = "flex-end")));
                  }
                }
              }
              c.current = d.scrollTop;
            }),
          }),
        }),
      ],
    });
  });
e0.displayName = ku;
var t0 = "SelectGroup",
  [y2, x2] = Go(t0),
  w2 = f.forwardRef((e, t) => {
    const { __scopeSelect: n, ...r } = e,
      o = Zn();
    return l.jsx(y2, {
      scope: n,
      id: o,
      children: l.jsx(H.div, {
        role: "group",
        "aria-labelledby": o,
        ...r,
        ref: t,
      }),
    });
  });
w2.displayName = t0;
var n0 = "SelectLabel",
  r0 = f.forwardRef((e, t) => {
    const { __scopeSelect: n, ...r } = e,
      o = x2(n0, n);
    return l.jsx(H.div, { id: o.id, ...r, ref: t });
  });
r0.displayName = n0;
var Al = "SelectItem",
  [S2, o0] = Go(Al),
  s0 = f.forwardRef((e, t) => {
    const {
        __scopeSelect: n,
        value: r,
        disabled: o = !1,
        textValue: s,
        ...i
      } = e,
      a = lr(Al, n),
      c = ar(Al, n),
      u = a.value === r,
      [d, p] = f.useState(s ?? ""),
      [h, x] = f.useState(!1),
      S = te(t, (m) => {
        var y;
        return (y = c.itemRefCallback) == null ? void 0 : y.call(c, m, r, o);
      }),
      v = Zn(),
      w = f.useRef("touch"),
      g = () => {
        o || (a.onValueChange(r), a.onOpenChange(!1));
      };
    if (r === "")
      throw new Error(
        "A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.",
      );
    return l.jsx(S2, {
      scope: n,
      value: r,
      disabled: o,
      textId: v,
      isSelected: u,
      onItemTextChange: f.useCallback((m) => {
        p((y) => y || ((m == null ? void 0 : m.textContent) ?? "").trim());
      }, []),
      children: l.jsx(fa.ItemSlot, {
        scope: n,
        value: r,
        disabled: o,
        textValue: d,
        children: l.jsx(H.div, {
          role: "option",
          "aria-labelledby": v,
          "data-highlighted": h ? "" : void 0,
          "aria-selected": u && h,
          "data-state": u ? "checked" : "unchecked",
          "aria-disabled": o || void 0,
          "data-disabled": o ? "" : void 0,
          tabIndex: o ? void 0 : -1,
          ...i,
          ref: S,
          onFocus: $(i.onFocus, () => x(!0)),
          onBlur: $(i.onBlur, () => x(!1)),
          onClick: $(i.onClick, () => {
            w.current !== "mouse" && g();
          }),
          onPointerUp: $(i.onPointerUp, () => {
            w.current === "mouse" && g();
          }),
          onPointerDown: $(i.onPointerDown, (m) => {
            w.current = m.pointerType;
          }),
          onPointerMove: $(i.onPointerMove, (m) => {
            var y;
            ((w.current = m.pointerType),
              o
                ? (y = c.onItemLeave) == null || y.call(c)
                : w.current === "mouse" &&
                  m.currentTarget.focus({ preventScroll: !0 }));
          }),
          onPointerLeave: $(i.onPointerLeave, (m) => {
            var y;
            m.currentTarget === document.activeElement &&
              ((y = c.onItemLeave) == null || y.call(c));
          }),
          onKeyDown: $(i.onKeyDown, (m) => {
            var b;
            (((b = c.searchRef) == null ? void 0 : b.current) !== "" &&
              m.key === " ") ||
              (i2.includes(m.key) && g(), m.key === " " && m.preventDefault());
          }),
        }),
      }),
    });
  });
s0.displayName = Al;
var ps = "SelectItemText",
  i0 = f.forwardRef((e, t) => {
    const { __scopeSelect: n, className: r, style: o, ...s } = e,
      i = lr(ps, n),
      a = ar(ps, n),
      c = o0(ps, n),
      u = u2(ps, n),
      [d, p] = f.useState(null),
      h = te(
        t,
        (g) => p(g),
        c.onItemTextChange,
        (g) => {
          var m;
          return (m = a.itemTextRefCallback) == null
            ? void 0
            : m.call(a, g, c.value, c.disabled);
        },
      ),
      x = d == null ? void 0 : d.textContent,
      S = f.useMemo(
        () =>
          l.jsx(
            "option",
            { value: c.value, disabled: c.disabled, children: x },
            c.value,
          ),
        [c.disabled, c.value, x],
      ),
      { onNativeOptionAdd: v, onNativeOptionRemove: w } = u;
    return (
      Ce(() => (v(S), () => w(S)), [v, w, S]),
      l.jsxs(l.Fragment, {
        children: [
          l.jsx(H.span, { id: c.textId, ...s, ref: h }),
          c.isSelected && i.valueNode && !i.valueNodeHasChildren
            ? zr.createPortal(s.children, i.valueNode)
            : null,
        ],
      })
    );
  });
i0.displayName = ps;
var l0 = "SelectItemIndicator",
  a0 = f.forwardRef((e, t) => {
    const { __scopeSelect: n, ...r } = e;
    return o0(l0, n).isSelected
      ? l.jsx(H.span, { "aria-hidden": !0, ...r, ref: t })
      : null;
  });
a0.displayName = l0;
var Pu = "SelectScrollUpButton",
  c0 = f.forwardRef((e, t) => {
    const n = ar(Pu, e.__scopeSelect),
      r = hf(Pu, e.__scopeSelect),
      [o, s] = f.useState(!1),
      i = te(t, r.onScrollButtonChange);
    return (
      Ce(() => {
        if (n.viewport && n.isPositioned) {
          let a = function () {
            const u = c.scrollTop > 0;
            s(u);
          };
          const c = n.viewport;
          return (
            a(),
            c.addEventListener("scroll", a),
            () => c.removeEventListener("scroll", a)
          );
        }
      }, [n.viewport, n.isPositioned]),
      o
        ? l.jsx(d0, {
            ...e,
            ref: i,
            onAutoScroll: () => {
              const { viewport: a, selectedItem: c } = n;
              a && c && (a.scrollTop = a.scrollTop - c.offsetHeight);
            },
          })
        : null
    );
  });
c0.displayName = Pu;
var Tu = "SelectScrollDownButton",
  u0 = f.forwardRef((e, t) => {
    const n = ar(Tu, e.__scopeSelect),
      r = hf(Tu, e.__scopeSelect),
      [o, s] = f.useState(!1),
      i = te(t, r.onScrollButtonChange);
    return (
      Ce(() => {
        if (n.viewport && n.isPositioned) {
          let a = function () {
            const u = c.scrollHeight - c.clientHeight,
              d = Math.ceil(c.scrollTop) < u;
            s(d);
          };
          const c = n.viewport;
          return (
            a(),
            c.addEventListener("scroll", a),
            () => c.removeEventListener("scroll", a)
          );
        }
      }, [n.viewport, n.isPositioned]),
      o
        ? l.jsx(d0, {
            ...e,
            ref: i,
            onAutoScroll: () => {
              const { viewport: a, selectedItem: c } = n;
              a && c && (a.scrollTop = a.scrollTop + c.offsetHeight);
            },
          })
        : null
    );
  });
u0.displayName = Tu;
var d0 = f.forwardRef((e, t) => {
    const { __scopeSelect: n, onAutoScroll: r, ...o } = e,
      s = ar("SelectScrollButton", n),
      i = f.useRef(null),
      a = pa(n),
      c = f.useCallback(() => {
        i.current !== null &&
          (window.clearInterval(i.current), (i.current = null));
      }, []);
    return (
      f.useEffect(() => () => c(), [c]),
      Ce(() => {
        var d;
        const u = a().find((p) => p.ref.current === document.activeElement);
        (d = u == null ? void 0 : u.ref.current) == null ||
          d.scrollIntoView({ block: "nearest" });
      }, [a]),
      l.jsx(H.div, {
        "aria-hidden": !0,
        ...o,
        ref: t,
        style: { flexShrink: 0, ...o.style },
        onPointerDown: $(o.onPointerDown, () => {
          i.current === null && (i.current = window.setInterval(r, 50));
        }),
        onPointerMove: $(o.onPointerMove, () => {
          var u;
          ((u = s.onItemLeave) == null || u.call(s),
            i.current === null && (i.current = window.setInterval(r, 50)));
        }),
        onPointerLeave: $(o.onPointerLeave, () => {
          c();
        }),
      })
    );
  }),
  b2 = "SelectSeparator",
  f0 = f.forwardRef((e, t) => {
    const { __scopeSelect: n, ...r } = e;
    return l.jsx(H.div, { "aria-hidden": !0, ...r, ref: t });
  });
f0.displayName = b2;
var Ru = "SelectArrow",
  C2 = f.forwardRef((e, t) => {
    const { __scopeSelect: n, ...r } = e,
      o = ha(n),
      s = lr(Ru, n),
      i = ar(Ru, n);
    return s.open && i.position === "popper"
      ? l.jsx(Dy, { ...o, ...r, ref: t })
      : null;
  });
C2.displayName = Ru;
function p0(e) {
  return e === "" || e === void 0;
}
var h0 = f.forwardRef((e, t) => {
  const { value: n, ...r } = e,
    o = f.useRef(null),
    s = te(t, o),
    i = o2(n);
  return (
    f.useEffect(() => {
      const a = o.current,
        c = window.HTMLSelectElement.prototype,
        d = Object.getOwnPropertyDescriptor(c, "value").set;
      if (i !== n && d) {
        const p = new Event("change", { bubbles: !0 });
        (d.call(a, n), a.dispatchEvent(p));
      }
    }, [i, n]),
    l.jsx(ti, {
      asChild: !0,
      children: l.jsx("select", { ...r, ref: s, defaultValue: n }),
    })
  );
});
h0.displayName = "BubbleSelect";
function m0(e) {
  const t = xe(e),
    n = f.useRef(""),
    r = f.useRef(0),
    o = f.useCallback(
      (i) => {
        const a = n.current + i;
        (t(a),
          (function c(u) {
            ((n.current = u),
              window.clearTimeout(r.current),
              u !== "" && (r.current = window.setTimeout(() => c(""), 1e3)));
          })(a));
      },
      [t],
    ),
    s = f.useCallback(() => {
      ((n.current = ""), window.clearTimeout(r.current));
    }, []);
  return (
    f.useEffect(() => () => window.clearTimeout(r.current), []),
    [n, o, s]
  );
}
function g0(e, t, n) {
  const o = t.length > 1 && Array.from(t).every((u) => u === t[0]) ? t[0] : t,
    s = n ? e.indexOf(n) : -1;
  let i = N2(e, Math.max(s, 0));
  o.length === 1 && (i = i.filter((u) => u !== n));
  const c = i.find((u) =>
    u.textValue.toLowerCase().startsWith(o.toLowerCase()),
  );
  return c !== n ? c : void 0;
}
function N2(e, t) {
  return e.map((n, r) => e[(t + r) % e.length]);
}
var E2 = Hx,
  v0 = Wx,
  j2 = Qx,
  k2 = Gx,
  P2 = Yx,
  y0 = qx,
  T2 = e0,
  x0 = r0,
  w0 = s0,
  R2 = i0,
  A2 = a0,
  S0 = c0,
  b0 = u0,
  C0 = f0;
const _2 = E2,
  O2 = j2,
  N0 = f.forwardRef(({ className: e, children: t, ...n }, r) =>
    l.jsxs(v0, {
      ref: r,
      className: q(
        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        e,
      ),
      ...n,
      children: [
        t,
        l.jsx(k2, {
          asChild: !0,
          children: l.jsx(Zv, { className: "h-4 w-4 opacity-50" }),
        }),
      ],
    }),
  );
N0.displayName = v0.displayName;
const E0 = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx(S0, {
    ref: n,
    className: q("flex cursor-default items-center justify-center py-1", e),
    ...t,
    children: l.jsx(QC, { className: "h-4 w-4" }),
  }),
);
E0.displayName = S0.displayName;
const j0 = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx(b0, {
    ref: n,
    className: q("flex cursor-default items-center justify-center py-1", e),
    ...t,
    children: l.jsx(Zv, { className: "h-4 w-4" }),
  }),
);
j0.displayName = b0.displayName;
const k0 = f.forwardRef(
  ({ className: e, children: t, position: n = "popper", ...r }, o) =>
    l.jsx(P2, {
      children: l.jsxs(y0, {
        ref: o,
        className: q(
          "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]",
          n === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          e,
        ),
        position: n,
        ...r,
        children: [
          l.jsx(E0, {}),
          l.jsx(T2, {
            className: q(
              "p-1",
              n === "popper" &&
                "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
            ),
            children: t,
          }),
          l.jsx(j0, {}),
        ],
      }),
    }),
);
k0.displayName = y0.displayName;
const I2 = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx(x0, {
    ref: n,
    className: q("py-1.5 pl-8 pr-2 text-sm font-semibold", e),
    ...t,
  }),
);
I2.displayName = x0.displayName;
const P0 = f.forwardRef(({ className: e, children: t, ...n }, r) =>
  l.jsxs(w0, {
    ref: r,
    className: q(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      e,
    ),
    ...n,
    children: [
      l.jsx("span", {
        className:
          "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
        children: l.jsx(A2, { children: l.jsx($d, { className: "h-4 w-4" }) }),
      }),
      l.jsx(R2, { children: t }),
    ],
  }),
);
P0.displayName = w0.displayName;
const M2 = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx(C0, { ref: n, className: q("-mx-1 my-1 h-px bg-muted", e), ...t }),
);
M2.displayName = C0.displayName;
const L2 = [
    { id: "all", label: "All Providers" },
    { id: "PhysicsWallah", label: "PhysicsWallah" },
    { id: "Unacademy", label: "Unacademy" },
    { id: "Byjus", label: "Byju's" },
    { id: "MadeEasy", label: "Made Easy" },
    { id: "AceAcademy", label: "Ace Academy" },
    { id: "YouTube", label: "Free/YouTube" },
  ],
  D2 = [
    { id: "all", label: "All Modes" },
    { id: "Live", label: "Live" },
    { id: "Recorded", label: "Recorded" },
    { id: "Hybrid", label: "Hybrid" },
  ],
  F2 = [
    { value: "relevance", label: "Relevance" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];
function z2() {
  const e = db(),
    t = new URLSearchParams(e),
    n = t.get("q") || "",
    r = t.get("exam") || "",
    [o, s] = f.useState(["all"]),
    [i, a] = f.useState(["all"]),
    [c, u] = f.useState("relevance"),
    [d, p] = f.useState([]),
    [h, x] = f.useState(!1),
    { data: S, isLoading: v } = Ot({ queryKey: ["/api/courses", n, r] }),
    { data: w } = Ot({ queryKey: ["/api/exams", r], enabled: !!r }),
    m = [
      ...((S == null
        ? void 0
        : S.filter(
            (N) =>
              !(
                (!o.includes("all") && !o.includes(N.provider)) ||
                (!i.includes("all") && !i.includes(N.mode))
              ),
          )) || []),
    ].sort((N, j) => {
      switch (c) {
        case "price-low":
          return N.price - j.price;
        case "price-high":
          return j.price - N.price;
        case "rating":
          return (j.rating || 0) - (N.rating || 0);
        default:
          return 0;
      }
    }),
    y = (N) => {
      s(
        N === "all"
          ? ["all"]
          : (j) => {
              const P = j.filter((R) => R !== "all");
              if (j.includes(N)) {
                const R = P.filter((M) => M !== N);
                return R.length === 0 ? ["all"] : R;
              }
              return [...P, N];
            },
      );
    },
    b = (N) => {
      a(
        N === "all"
          ? ["all"]
          : (j) => {
              const P = j.filter((R) => R !== "all");
              if (j.includes(N)) {
                const R = P.filter((M) => M !== N);
                return R.length === 0 ? ["all"] : R;
              }
              return [...P, N];
            },
      );
    },
    E = (N) => {
      p((j) =>
        j.some((R) => R.id === N.id)
          ? j.filter((R) => R.id !== N.id)
          : j.length >= 4
            ? j
            : [...j, N],
      );
    },
    k = (N) => {
      p((j) => j.filter((P) => P.id !== N));
    };
  return l.jsxs("div", {
    className: "min-h-screen pb-20 md:pb-8",
    children: [
      l.jsx("div", {
        className: "bg-muted/30 border-b py-6",
        children: l.jsx("div", {
          className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          children: l.jsx("div", {
            className: "max-w-2xl",
            children: l.jsx(Gy, { placeholder: "Search courses, exams..." }),
          }),
        }),
      }),
      l.jsxs("div", {
        className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6",
        children: [
          l.jsxs("div", {
            className: "mb-6",
            children: [
              w
                ? l.jsxs("div", {
                    className: "flex items-center gap-2 flex-wrap",
                    children: [
                      l.jsxs("h1", {
                        className: "text-2xl font-semibold",
                        "data-testid": "text-search-title",
                        children: ["Courses for ", w.name],
                      }),
                      l.jsx(_e, {
                        variant: "secondary",
                        children: w.category.replace("_", " "),
                      }),
                    ],
                  })
                : n
                  ? l.jsxs("h1", {
                      className: "text-2xl font-semibold",
                      "data-testid": "text-search-title",
                      children: ['Results for "', n, '"'],
                    })
                  : l.jsx("h1", {
                      className: "text-2xl font-semibold",
                      "data-testid": "text-search-title",
                      children: "All Courses",
                    }),
              l.jsxs("p", {
                className: "text-muted-foreground mt-1",
                children: [
                  (m == null ? void 0 : m.length) || 0,
                  " courses found",
                ],
              }),
            ],
          }),
          l.jsxs("div", {
            className: "flex flex-col md:flex-row gap-4 mb-6",
            children: [
              l.jsxs("div", {
                className: "flex-1 space-y-3",
                children: [
                  l.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      l.jsx(nN, { className: "h-4 w-4 text-muted-foreground" }),
                      l.jsx("span", {
                        className: "text-sm font-medium",
                        children: "Providers",
                      }),
                    ],
                  }),
                  l.jsx(po, { filters: L2, selectedFilters: o, onToggle: y }),
                ],
              }),
              l.jsxs("div", {
                className: "flex-1 space-y-3",
                children: [
                  l.jsx("div", {
                    className: "flex items-center gap-2",
                    children: l.jsx("span", {
                      className: "text-sm font-medium",
                      children: "Mode",
                    }),
                  }),
                  l.jsx(po, { filters: D2, selectedFilters: i, onToggle: b }),
                ],
              }),
              l.jsxs("div", {
                className: "w-full md:w-48",
                children: [
                  l.jsx("label", {
                    className: "text-sm font-medium block mb-2",
                    children: "Sort by",
                  }),
                  l.jsxs(_2, {
                    value: c,
                    onValueChange: u,
                    children: [
                      l.jsx(N0, {
                        "data-testid": "select-sort",
                        children: l.jsx(O2, {}),
                      }),
                      l.jsx(k0, {
                        children: F2.map((N) =>
                          l.jsx(
                            P0,
                            { value: N.value, children: N.label },
                            N.value,
                          ),
                        ),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          d.length > 0 &&
            l.jsxs("div", {
              className:
                "flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg",
              children: [
                l.jsx("span", {
                  className: "text-sm font-medium",
                  children: "Comparing:",
                }),
                d.map((N) =>
                  l.jsxs(
                    _e,
                    {
                      variant: "secondary",
                      className: "gap-1",
                      children: [
                        N.name.slice(0, 20),
                        "...",
                        l.jsx("button", {
                          onClick: () => k(N.id),
                          children: l.jsx(ni, { className: "h-3 w-3" }),
                        }),
                      ],
                    },
                    N.id,
                  ),
                ),
                l.jsx(we, {
                  size: "sm",
                  onClick: () => x(!0),
                  "data-testid": "button-compare-now",
                  children: "Compare Now",
                }),
              ],
            }),
          v
            ? l.jsx("div", {
                className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
                children: Array.from({ length: 6 }).map((N, j) =>
                  l.jsx(Yy, {}, j),
                ),
              })
            : m && m.length > 0
              ? l.jsx("div", {
                  className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
                  children: m.map((N) =>
                    l.jsx(
                      ef,
                      {
                        course: N,
                        isSelected: d.some((j) => j.id === N.id),
                        onSelect: E,
                      },
                      N.id,
                    ),
                  ),
                })
              : l.jsx("div", {
                  className: "text-center py-16",
                  children: l.jsx("p", {
                    className: "text-muted-foreground",
                    children: "No courses found. Try adjusting your filters.",
                  }),
                }),
        ],
      }),
      l.jsx(r2, { count: d.length, onClick: () => x(!0) }),
      l.jsx(n2, {
        courses: d,
        isOpen: h,
        onClose: () => x(!1),
        onRemoveCourse: k,
      }),
    ],
  });
}
var sc = "rovingFocusGroup.onEntryFocus",
  $2 = { bubbles: !1, cancelable: !0 },
  ma = "RovingFocusGroup",
  [Au, T0, U2] = Id(ma),
  [B2, R0] = en(ma, [U2]),
  [H2, V2] = B2(ma),
  A0 = f.forwardRef((e, t) =>
    l.jsx(Au.Provider, {
      scope: e.__scopeRovingFocusGroup,
      children: l.jsx(Au.Slot, {
        scope: e.__scopeRovingFocusGroup,
        children: l.jsx(W2, { ...e, ref: t }),
      }),
    }),
  );
A0.displayName = ma;
var W2 = f.forwardRef((e, t) => {
    const {
        __scopeRovingFocusGroup: n,
        orientation: r,
        loop: o = !1,
        dir: s,
        currentTabStopId: i,
        defaultCurrentTabStopId: a,
        onCurrentTabStopIdChange: c,
        onEntryFocus: u,
        preventScrollOnEntryFocus: d = !1,
        ...p
      } = e,
      h = f.useRef(null),
      x = te(t, h),
      S = aa(s),
      [v = null, w] = Lo({ prop: i, defaultProp: a, onChange: c }),
      [g, m] = f.useState(!1),
      y = xe(u),
      b = T0(n),
      E = f.useRef(!1),
      [k, N] = f.useState(0);
    return (
      f.useEffect(() => {
        const j = h.current;
        if (j)
          return (
            j.addEventListener(sc, y),
            () => j.removeEventListener(sc, y)
          );
      }, [y]),
      l.jsx(H2, {
        scope: n,
        orientation: r,
        dir: S,
        loop: o,
        currentTabStopId: v,
        onItemFocus: f.useCallback((j) => w(j), [w]),
        onItemShiftTab: f.useCallback(() => m(!0), []),
        onFocusableItemAdd: f.useCallback(() => N((j) => j + 1), []),
        onFocusableItemRemove: f.useCallback(() => N((j) => j - 1), []),
        children: l.jsx(H.div, {
          tabIndex: g || k === 0 ? -1 : 0,
          "data-orientation": r,
          ...p,
          ref: x,
          style: { outline: "none", ...e.style },
          onMouseDown: $(e.onMouseDown, () => {
            E.current = !0;
          }),
          onFocus: $(e.onFocus, (j) => {
            const P = !E.current;
            if (j.target === j.currentTarget && P && !g) {
              const R = new CustomEvent(sc, $2);
              if ((j.currentTarget.dispatchEvent(R), !R.defaultPrevented)) {
                const M = b().filter((F) => F.focusable),
                  I = M.find((F) => F.active),
                  V = M.find((F) => F.id === v),
                  K = [I, V, ...M].filter(Boolean).map((F) => F.ref.current);
                I0(K, d);
              }
            }
            E.current = !1;
          }),
          onBlur: $(e.onBlur, () => m(!1)),
        }),
      })
    );
  }),
  _0 = "RovingFocusGroupItem",
  O0 = f.forwardRef((e, t) => {
    const {
        __scopeRovingFocusGroup: n,
        focusable: r = !0,
        active: o = !1,
        tabStopId: s,
        ...i
      } = e,
      a = Zn(),
      c = s || a,
      u = V2(_0, n),
      d = u.currentTabStopId === c,
      p = T0(n),
      { onFocusableItemAdd: h, onFocusableItemRemove: x } = u;
    return (
      f.useEffect(() => {
        if (r) return (h(), () => x());
      }, [r, h, x]),
      l.jsx(Au.ItemSlot, {
        scope: n,
        id: c,
        focusable: r,
        active: o,
        children: l.jsx(H.span, {
          tabIndex: d ? 0 : -1,
          "data-orientation": u.orientation,
          ...i,
          ref: t,
          onMouseDown: $(e.onMouseDown, (S) => {
            r ? u.onItemFocus(c) : S.preventDefault();
          }),
          onFocus: $(e.onFocus, () => u.onItemFocus(c)),
          onKeyDown: $(e.onKeyDown, (S) => {
            if (S.key === "Tab" && S.shiftKey) {
              u.onItemShiftTab();
              return;
            }
            if (S.target !== S.currentTarget) return;
            const v = G2(S, u.orientation, u.dir);
            if (v !== void 0) {
              if (S.metaKey || S.ctrlKey || S.altKey || S.shiftKey) return;
              S.preventDefault();
              let g = p()
                .filter((m) => m.focusable)
                .map((m) => m.ref.current);
              if (v === "last") g.reverse();
              else if (v === "prev" || v === "next") {
                v === "prev" && g.reverse();
                const m = g.indexOf(S.currentTarget);
                g = u.loop ? Y2(g, m + 1) : g.slice(m + 1);
              }
              setTimeout(() => I0(g));
            }
          }),
        }),
      })
    );
  });
O0.displayName = _0;
var K2 = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last",
};
function Q2(e, t) {
  return t !== "rtl"
    ? e
    : e === "ArrowLeft"
      ? "ArrowRight"
      : e === "ArrowRight"
        ? "ArrowLeft"
        : e;
}
function G2(e, t, n) {
  const r = Q2(e.key, n);
  if (
    !(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) &&
    !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r))
  )
    return K2[r];
}
function I0(e, t = !1) {
  const n = document.activeElement;
  for (const r of e)
    if (
      r === n ||
      (r.focus({ preventScroll: t }), document.activeElement !== n)
    )
      return;
}
function Y2(e, t) {
  return e.map((n, r) => e[(t + r) % e.length]);
}
var q2 = A0,
  X2 = O0,
  mf = "Tabs",
  [Z2, QP] = en(mf, [R0]),
  M0 = R0(),
  [J2, gf] = Z2(mf),
  L0 = f.forwardRef((e, t) => {
    const {
        __scopeTabs: n,
        value: r,
        onValueChange: o,
        defaultValue: s,
        orientation: i = "horizontal",
        dir: a,
        activationMode: c = "automatic",
        ...u
      } = e,
      d = aa(a),
      [p, h] = Lo({ prop: r, onChange: o, defaultProp: s });
    return l.jsx(J2, {
      scope: n,
      baseId: Zn(),
      value: p,
      onValueChange: h,
      orientation: i,
      dir: d,
      activationMode: c,
      children: l.jsx(H.div, { dir: d, "data-orientation": i, ...u, ref: t }),
    });
  });
L0.displayName = mf;
var D0 = "TabsList",
  F0 = f.forwardRef((e, t) => {
    const { __scopeTabs: n, loop: r = !0, ...o } = e,
      s = gf(D0, n),
      i = M0(n);
    return l.jsx(q2, {
      asChild: !0,
      ...i,
      orientation: s.orientation,
      dir: s.dir,
      loop: r,
      children: l.jsx(H.div, {
        role: "tablist",
        "aria-orientation": s.orientation,
        ...o,
        ref: t,
      }),
    });
  });
F0.displayName = D0;
var z0 = "TabsTrigger",
  $0 = f.forwardRef((e, t) => {
    const { __scopeTabs: n, value: r, disabled: o = !1, ...s } = e,
      i = gf(z0, n),
      a = M0(n),
      c = H0(i.baseId, r),
      u = V0(i.baseId, r),
      d = r === i.value;
    return l.jsx(X2, {
      asChild: !0,
      ...a,
      focusable: !o,
      active: d,
      children: l.jsx(H.button, {
        type: "button",
        role: "tab",
        "aria-selected": d,
        "aria-controls": u,
        "data-state": d ? "active" : "inactive",
        "data-disabled": o ? "" : void 0,
        disabled: o,
        id: c,
        ...s,
        ref: t,
        onMouseDown: $(e.onMouseDown, (p) => {
          !o && p.button === 0 && p.ctrlKey === !1
            ? i.onValueChange(r)
            : p.preventDefault();
        }),
        onKeyDown: $(e.onKeyDown, (p) => {
          [" ", "Enter"].includes(p.key) && i.onValueChange(r);
        }),
        onFocus: $(e.onFocus, () => {
          const p = i.activationMode !== "manual";
          !d && !o && p && i.onValueChange(r);
        }),
      }),
    });
  });
$0.displayName = z0;
var U0 = "TabsContent",
  B0 = f.forwardRef((e, t) => {
    const { __scopeTabs: n, value: r, forceMount: o, children: s, ...i } = e,
      a = gf(U0, n),
      c = H0(a.baseId, r),
      u = V0(a.baseId, r),
      d = r === a.value,
      p = f.useRef(d);
    return (
      f.useEffect(() => {
        const h = requestAnimationFrame(() => (p.current = !1));
        return () => cancelAnimationFrame(h);
      }, []),
      l.jsx(Dt, {
        present: o || d,
        children: ({ present: h }) =>
          l.jsx(H.div, {
            "data-state": d ? "active" : "inactive",
            "data-orientation": a.orientation,
            role: "tabpanel",
            "aria-labelledby": c,
            hidden: !h,
            id: u,
            tabIndex: 0,
            ...i,
            ref: t,
            style: { ...e.style, animationDuration: p.current ? "0s" : void 0 },
            children: h && s,
          }),
      })
    );
  });
B0.displayName = U0;
function H0(e, t) {
  return `${e}-trigger-${t}`;
}
function V0(e, t) {
  return `${e}-content-${t}`;
}
var eP = L0,
  W0 = F0,
  K0 = $0,
  Q0 = B0;
const G0 = eP,
  vf = f.forwardRef(({ className: e, ...t }, n) =>
    l.jsx(W0, {
      ref: n,
      className: q(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        e,
      ),
      ...t,
    }),
  );
vf.displayName = W0.displayName;
const mr = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx(K0, {
    ref: n,
    className: q(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      e,
    ),
    ...t,
  }),
);
mr.displayName = K0.displayName;
const gr = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx(Q0, {
    ref: n,
    className: q(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      e,
    ),
    ...t,
  }),
);
gr.displayName = Q0.displayName;
function _i({ icon: e, label: t, value: n, description: r }) {
  return l.jsx(Te, {
    className: "overflow-visible",
    children: l.jsx(Re, {
      className: "p-4",
      children: l.jsxs("div", {
        className: "flex items-start gap-3",
        children: [
          l.jsx("div", {
            className:
              "h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0",
            children: l.jsx(e, { className: "h-5 w-5 text-primary" }),
          }),
          l.jsxs("div", {
            children: [
              l.jsx("p", {
                className: "text-sm text-muted-foreground",
                children: t,
              }),
              l.jsx("p", { className: "font-semibold text-lg", children: n }),
              r &&
                l.jsx("p", {
                  className: "text-xs text-muted-foreground mt-0.5",
                  children: r,
                }),
            ],
          }),
        ],
      }),
    }),
  });
}
function wh({ className: e, ...t }) {
  return l.jsx("div", {
    className: q("animate-pulse rounded-md bg-muted", e),
    ...t,
  });
}
const tP = {
  beginner: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  intermediate:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  advanced: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};
function nP() {
  var a;
  const t = ov().id,
    { data: n, isLoading: r } = Ot({ queryKey: ["/api/exams", t] }),
    { data: o, isLoading: s } = Ot({ queryKey: ["/api/courses", "", t] }),
    { data: i } = Ot({
      queryKey: ["/api/exams/related", t],
      enabled: !!(
        (a = n == null ? void 0 : n.relatedExams) != null && a.length
      ),
    });
  return r
    ? l.jsx("div", {
        className: "min-h-screen pb-20 md:pb-8",
        children: l.jsx("div", {
          className: "bg-gradient-to-b from-primary/5 to-background py-12",
          children: l.jsxs("div", {
            className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
            children: [
              l.jsx(wh, { className: "h-8 w-64 mb-2" }),
              l.jsx(wh, { className: "h-6 w-96" }),
            ],
          }),
        }),
      })
    : n
      ? l.jsxs("div", {
          className: "min-h-screen pb-20 md:pb-8",
          children: [
            l.jsx("section", {
              className: "bg-gradient-to-b from-primary/5 to-background py-12",
              children: l.jsxs("div", {
                className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
                children: [
                  l.jsxs("div", {
                    className:
                      "flex items-start justify-between gap-4 flex-wrap",
                    children: [
                      l.jsxs("div", {
                        children: [
                          l.jsxs("div", {
                            className: "flex items-center gap-3 mb-2",
                            children: [
                              l.jsx("div", {
                                className:
                                  "h-12 w-12 rounded-md bg-primary flex items-center justify-center",
                                children: l.jsx(Xt, {
                                  className: "h-6 w-6 text-primary-foreground",
                                }),
                              }),
                              l.jsxs("div", {
                                children: [
                                  l.jsx("h1", {
                                    className: "text-3xl font-bold",
                                    "data-testid": "text-exam-name",
                                    children: n.name,
                                  }),
                                  l.jsx("p", {
                                    className: "text-muted-foreground",
                                    children: n.shortName,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "flex items-center gap-2 mt-4 flex-wrap",
                            children: [
                              l.jsx(_e, {
                                variant: "secondary",
                                children: n.category.replace("_", " "),
                              }),
                              l.jsx(_e, {
                                className: tP[n.difficulty],
                                children: n.difficulty,
                              }),
                            ],
                          }),
                        ],
                      }),
                      n.officialWebsite &&
                        l.jsx(we, {
                          variant: "outline",
                          asChild: !0,
                          children: l.jsxs("a", {
                            href: n.officialWebsite,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            "data-testid": "link-official-website",
                            children: [
                              "Official Website",
                              l.jsx(ey, { className: "h-4 w-4 ml-2" }),
                            ],
                          }),
                        }),
                    ],
                  }),
                  l.jsxs("div", {
                    className: "grid grid-cols-2 md:grid-cols-4 gap-4 mt-8",
                    children: [
                      l.jsx(_i, {
                        icon: Xp,
                        label: "Difficulty",
                        value: n.difficulty,
                      }),
                      l.jsx(_i, {
                        icon: Or,
                        label: "Annual Candidates",
                        value: n.totalCandidates || "N/A",
                      }),
                      l.jsx(_i, {
                        icon: oy,
                        label: "Avg. Salary",
                        value: n.averageSalary || "Varies",
                      }),
                      l.jsx(_i, {
                        icon: Bs,
                        label: "Category",
                        value: n.category.replace("_", " "),
                      }),
                    ],
                  }),
                ],
              }),
            }),
            l.jsx("section", {
              className: "py-8",
              children: l.jsx("div", {
                className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
                children: l.jsxs(G0, {
                  defaultValue: "overview",
                  className: "w-full",
                  children: [
                    l.jsxs(vf, {
                      className:
                        "w-full md:w-auto flex flex-wrap h-auto gap-1 bg-muted p-1 rounded-lg",
                      children: [
                        l.jsx(mr, {
                          value: "overview",
                          "data-testid": "tab-overview",
                          children: "Overview",
                        }),
                        l.jsx(mr, {
                          value: "eligibility",
                          "data-testid": "tab-eligibility",
                          children: "Eligibility",
                        }),
                        l.jsx(mr, {
                          value: "dates",
                          "data-testid": "tab-dates",
                          children: "Important Dates",
                        }),
                        l.jsxs(mr, {
                          value: "courses",
                          "data-testid": "tab-courses",
                          children: [
                            "Courses (",
                            (o == null ? void 0 : o.length) || 0,
                            ")",
                          ],
                        }),
                      ],
                    }),
                    l.jsxs(gr, {
                      value: "overview",
                      className: "mt-6 space-y-6",
                      children: [
                        l.jsxs(Te, {
                          children: [
                            l.jsx(an, {
                              children: l.jsxs(dr, {
                                className: "flex items-center gap-2",
                                children: [
                                  l.jsx(Bs, { className: "h-5 w-5" }),
                                  "About ",
                                  n.shortName,
                                ],
                              }),
                            }),
                            l.jsx(Re, {
                              children: l.jsx("p", {
                                className:
                                  "text-muted-foreground leading-relaxed",
                                children: n.description,
                              }),
                            }),
                          ],
                        }),
                        l.jsxs(Te, {
                          children: [
                            l.jsx(an, {
                              children: l.jsxs(dr, {
                                className: "flex items-center gap-2",
                                children: [
                                  l.jsx(Xv, { className: "h-5 w-5" }),
                                  "Career Outcomes",
                                ],
                              }),
                            }),
                            l.jsx(Re, {
                              children: l.jsx("div", {
                                className: "flex flex-wrap gap-2",
                                children: n.careerOutcomes.map((c, u) =>
                                  l.jsx(
                                    _e,
                                    { variant: "secondary", children: c },
                                    u,
                                  ),
                                ),
                              }),
                            }),
                          ],
                        }),
                        l.jsxs(Te, {
                          children: [
                            l.jsx(an, {
                              children: l.jsxs(dr, {
                                className: "flex items-center gap-2",
                                children: [
                                  l.jsx(Xp, { className: "h-5 w-5" }),
                                  "Exam Pattern",
                                ],
                              }),
                            }),
                            l.jsx(Re, {
                              children: l.jsx("p", {
                                className:
                                  "text-muted-foreground whitespace-pre-line",
                                children: n.examPattern,
                              }),
                            }),
                          ],
                        }),
                        i &&
                          i.length > 0 &&
                          l.jsxs(Te, {
                            children: [
                              l.jsx(an, {
                                children: l.jsx(dr, {
                                  children: "Related Exams",
                                }),
                              }),
                              l.jsx(Re, {
                                children: l.jsx("div", {
                                  className: "flex flex-wrap gap-3",
                                  children: i.map((c) =>
                                    l.jsx(
                                      xt,
                                      {
                                        href: `/exam/${c.id}`,
                                        children: l.jsxs(we, {
                                          variant: "outline",
                                          className: "gap-2",
                                          children: [
                                            l.jsx(Xt, { className: "h-4 w-4" }),
                                            c.shortName,
                                          ],
                                        }),
                                      },
                                      c.id,
                                    ),
                                  ),
                                }),
                              }),
                            ],
                          }),
                      ],
                    }),
                    l.jsx(gr, {
                      value: "eligibility",
                      className: "mt-6",
                      children: l.jsxs(Te, {
                        children: [
                          l.jsx(an, {
                            children: l.jsxs(dr, {
                              className: "flex items-center gap-2",
                              children: [
                                l.jsx(YC, { className: "h-5 w-5" }),
                                "Eligibility Criteria",
                              ],
                            }),
                          }),
                          l.jsx(Re, {
                            children: l.jsx("p", {
                              className:
                                "text-muted-foreground whitespace-pre-line leading-relaxed",
                              children: n.eligibility,
                            }),
                          }),
                        ],
                      }),
                    }),
                    l.jsx(gr, {
                      value: "dates",
                      className: "mt-6",
                      children: l.jsxs(Te, {
                        children: [
                          l.jsx(an, {
                            children: l.jsxs(dr, {
                              className: "flex items-center gap-2",
                              children: [
                                l.jsx(yn, { className: "h-5 w-5" }),
                                "Important Dates",
                              ],
                            }),
                          }),
                          l.jsx(Re, {
                            children: l.jsx("div", {
                              className: "space-y-4",
                              children: n.importantDates.map((c, u) =>
                                l.jsxs(
                                  "div",
                                  {
                                    className:
                                      "flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0",
                                    children: [
                                      l.jsx("div", {
                                        className:
                                          "h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0",
                                        children: l.jsx(Jv, {
                                          className: "h-5 w-5 text-primary",
                                        }),
                                      }),
                                      l.jsxs("div", {
                                        children: [
                                          l.jsx("p", {
                                            className: "font-medium",
                                            children: c.event,
                                          }),
                                          l.jsx("p", {
                                            className:
                                              "text-sm text-muted-foreground",
                                            children: c.date,
                                          }),
                                          c.description &&
                                            l.jsx("p", {
                                              className:
                                                "text-sm text-muted-foreground mt-1",
                                              children: c.description,
                                            }),
                                        ],
                                      }),
                                    ],
                                  },
                                  u,
                                ),
                              ),
                            }),
                          }),
                        ],
                      }),
                    }),
                    l.jsxs(gr, {
                      value: "courses",
                      className: "mt-6",
                      children: [
                        l.jsxs("div", {
                          className: "flex items-center justify-between mb-6",
                          children: [
                            l.jsx("h3", {
                              className: "text-xl font-semibold",
                              children: "Available Courses",
                            }),
                            l.jsx(xt, {
                              href: `/search?exam=${t}`,
                              children: l.jsxs(we, {
                                variant: "outline",
                                className: "gap-1",
                                "data-testid": "link-view-all-courses",
                                children: [
                                  "View all ",
                                  l.jsx(yu, { className: "h-4 w-4" }),
                                ],
                              }),
                            }),
                          ],
                        }),
                        s
                          ? l.jsx("div", {
                              className:
                                "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
                              children: Array.from({ length: 3 }).map((c, u) =>
                                l.jsx(Yy, {}, u),
                              ),
                            })
                          : o && o.length > 0
                            ? l.jsx("div", {
                                className:
                                  "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
                                children: o
                                  .slice(0, 6)
                                  .map((c) => l.jsx(ef, { course: c }, c.id)),
                              })
                            : l.jsx("div", {
                                className: "text-center py-12",
                                children: l.jsx("p", {
                                  className: "text-muted-foreground",
                                  children:
                                    "No courses available for this exam yet.",
                                }),
                              }),
                      ],
                    }),
                  ],
                }),
              }),
            }),
          ],
        })
      : l.jsx("div", {
          className: "min-h-screen flex items-center justify-center",
          children: l.jsxs("div", {
            className: "text-center",
            children: [
              l.jsx(Xt, {
                className: "h-16 w-16 mx-auto text-muted-foreground mb-4",
              }),
              l.jsx("h1", {
                className: "text-2xl font-semibold mb-2",
                children: "Exam Not Found",
              }),
              l.jsx("p", {
                className: "text-muted-foreground mb-4",
                children: "The exam you're looking for doesn't exist.",
              }),
              l.jsx(xt, {
                href: "/",
                children: l.jsx(we, { children: "Go Home" }),
              }),
            ],
          }),
        });
}
var yf = "Avatar",
  [rP, GP] = en(yf),
  [oP, Y0] = rP(yf),
  q0 = f.forwardRef((e, t) => {
    const { __scopeAvatar: n, ...r } = e,
      [o, s] = f.useState("idle");
    return l.jsx(oP, {
      scope: n,
      imageLoadingStatus: o,
      onImageLoadingStatusChange: s,
      children: l.jsx(H.span, { ...r, ref: t }),
    });
  });
q0.displayName = yf;
var X0 = "AvatarImage",
  Z0 = f.forwardRef((e, t) => {
    const {
        __scopeAvatar: n,
        src: r,
        onLoadingStatusChange: o = () => {},
        ...s
      } = e,
      i = Y0(X0, n),
      a = sP(r, s),
      c = xe((u) => {
        (o(u), i.onImageLoadingStatusChange(u));
      });
    return (
      Ce(() => {
        a !== "idle" && c(a);
      }, [a, c]),
      a === "loaded" ? l.jsx(H.img, { ...s, ref: t, src: r }) : null
    );
  });
Z0.displayName = X0;
var J0 = "AvatarFallback",
  ew = f.forwardRef((e, t) => {
    const { __scopeAvatar: n, delayMs: r, ...o } = e,
      s = Y0(J0, n),
      [i, a] = f.useState(r === void 0);
    return (
      f.useEffect(() => {
        if (r !== void 0) {
          const c = window.setTimeout(() => a(!0), r);
          return () => window.clearTimeout(c);
        }
      }, [r]),
      i && s.imageLoadingStatus !== "loaded"
        ? l.jsx(H.span, { ...o, ref: t })
        : null
    );
  });
ew.displayName = J0;
function Sh(e, t) {
  return e
    ? t
      ? (e.src !== t && (e.src = t),
        e.complete && e.naturalWidth > 0 ? "loaded" : "loading")
      : "error"
    : "idle";
}
function sP(e, { referrerPolicy: t, crossOrigin: n }) {
  const r = lP(),
    o = f.useRef(null),
    s = r ? (o.current || (o.current = new window.Image()), o.current) : null,
    [i, a] = f.useState(() => Sh(s, e));
  return (
    Ce(() => {
      a(Sh(s, e));
    }, [s, e]),
    Ce(() => {
      const c = (p) => () => {
        a(p);
      };
      if (!s) return;
      const u = c("loaded"),
        d = c("error");
      return (
        s.addEventListener("load", u),
        s.addEventListener("error", d),
        t && (s.referrerPolicy = t),
        typeof n == "string" && (s.crossOrigin = n),
        () => {
          (s.removeEventListener("load", u), s.removeEventListener("error", d));
        }
      );
    }, [s, n, t]),
    i
  );
}
function iP() {
  return () => {};
}
function lP() {
  return f.useSyncExternalStore(
    iP,
    () => !0,
    () => !1,
  );
}
var tw = q0,
  nw = Z0,
  rw = ew;
const _l = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx(tw, {
    ref: n,
    className: q(
      `
      after:content-[''] after:block after:absolute after:inset-0 after:rounded-full after:pointer-events-none after:border after:border-black/10 dark:after:border-white/10
      relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full`,
      e,
    ),
    ...t,
  }),
);
_l.displayName = tw.displayName;
const ow = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx(nw, { ref: n, className: q("aspect-square h-full w-full", e), ...t }),
);
ow.displayName = nw.displayName;
const Ol = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx(rw, {
    ref: n,
    className: q(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      e,
    ),
    ...t,
  }),
);
Ol.displayName = rw.displayName;
var sw = {
    color: void 0,
    size: void 0,
    className: void 0,
    style: void 0,
    attr: void 0,
  },
  bh = Qe.createContext && Qe.createContext(sw),
  aP = ["attr", "size", "title"];
function cP(e, t) {
  if (e == null) return {};
  var n = uP(e, t),
    r,
    o;
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    for (o = 0; o < s.length; o++)
      ((r = s[o]),
        !(t.indexOf(r) >= 0) &&
          Object.prototype.propertyIsEnumerable.call(e, r) &&
          (n[r] = e[r]));
  }
  return n;
}
function uP(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if (Object.prototype.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) >= 0) continue;
      n[r] = e[r];
    }
  return n;
}
function Il() {
  return (
    (Il = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Il.apply(this, arguments)
  );
}
function Ch(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    (t &&
      (r = r.filter(function (o) {
        return Object.getOwnPropertyDescriptor(e, o).enumerable;
      })),
      n.push.apply(n, r));
  }
  return n;
}
function Ml(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Ch(Object(n), !0).forEach(function (r) {
          dP(e, r, n[r]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : Ch(Object(n)).forEach(function (r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
          });
  }
  return e;
}
function dP(e, t, n) {
  return (
    (t = fP(t)),
    t in e
      ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[t] = n),
    e
  );
}
function fP(e) {
  var t = pP(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function pP(e, t) {
  if (typeof e != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t || "default");
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function iw(e) {
  return (
    e &&
    e.map((t, n) =>
      Qe.createElement(t.tag, Ml({ key: n }, t.attr), iw(t.child)),
    )
  );
}
function hP(e) {
  return (t) =>
    Qe.createElement(mP, Il({ attr: Ml({}, e.attr) }, t), iw(e.child));
}
function mP(e) {
  var t = (n) => {
    var { attr: r, size: o, title: s } = e,
      i = cP(e, aP),
      a = o || n.size || "1em",
      c;
    return (
      n.className && (c = n.className),
      e.className && (c = (c ? c + " " : "") + e.className),
      Qe.createElement(
        "svg",
        Il(
          { stroke: "currentColor", fill: "currentColor", strokeWidth: "0" },
          n.attr,
          r,
          i,
          {
            className: c,
            style: Ml(Ml({ color: e.color || n.color }, n.style), e.style),
            height: a,
            width: a,
            xmlns: "http://www.w3.org/2000/svg",
          },
        ),
        s && Qe.createElement("title", null, s),
        e.children,
      )
    );
  };
  return bh !== void 0
    ? Qe.createElement(bh.Consumer, null, (n) => t(n))
    : t(sw);
}
function gP(e) {
  return hP({
    tag: "svg",
    attr: { role: "img", viewBox: "0 0 24 24" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M.715 2.188a.696.696 0 00-.711.713H0l.002.027c-.01.306.03.658.123 1.081.905 5.546 5.875 9.788 11.87 9.788 5.935 0 10.864-4.157 11.84-9.622.126-.512.177-.921.162-1.273a.696.696 0 00-.713-.714zm11.243 13.82c-2.967 0-5.432 2.079-5.92 4.81a2.287 2.287 0 00-.08.638c0 .201.15.356.355.356h11.285a.348.348 0 00.356-.356h.002v-.014a2.21 2.21 0 00-.063-.54c-.453-2.774-2.938-4.894-5.935-4.894z",
        },
        child: [],
      },
    ],
  })(e);
}
const vP = {
    beginner:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    intermediate:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    advanced: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    all: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  yP = {
    conceptual: "Conceptual Teaching",
    "problem-solving": "Problem Solving",
    "exam-focused": "Exam Focused",
    comprehensive: "Comprehensive",
  };
function xP({ educator: e, onBookmark: t, isBookmarked: n }) {
  const r = e.name
    .split(" ")
    .map((o) => o[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return l.jsx(Te, {
    className: "overflow-visible hover-elevate",
    "data-testid": `card-educator-${e.id}`,
    children: l.jsxs(Re, {
      className: "p-4",
      children: [
        l.jsxs("div", {
          className: "flex items-start gap-4",
          children: [
            l.jsxs("div", {
              className: "relative",
              children: [
                l.jsxs(_l, {
                  className: "h-16 w-16",
                  children: [
                    l.jsx(ow, { src: e.avatar, alt: e.name }),
                    l.jsx(Ol, {
                      className:
                        "bg-primary text-primary-foreground text-lg font-semibold",
                      children: r,
                    }),
                  ],
                }),
                l.jsx("div", {
                  className: "absolute -bottom-1 -right-1 flex gap-0.5",
                  children: e.platforms
                    .slice(0, 2)
                    .map((o) =>
                      o === "YouTube"
                        ? l.jsx(
                            "div",
                            {
                              className:
                                "h-5 w-5 rounded-full bg-red-600 flex items-center justify-center",
                              children: l.jsx(iN, {
                                className: "h-3 w-3 text-white",
                              }),
                            },
                            o,
                          )
                        : o === "Unacademy"
                          ? l.jsx(
                              "div",
                              {
                                className:
                                  "h-5 w-5 rounded-full bg-green-600 flex items-center justify-center",
                                children: l.jsx(gP, {
                                  className: "h-3 w-3 text-white",
                                }),
                              },
                              o,
                            )
                          : null,
                    ),
                }),
              ],
            }),
            l.jsxs("div", {
              className: "flex-1 min-w-0",
              children: [
                l.jsx("h3", {
                  className: "font-semibold truncate",
                  "data-testid": `text-educator-name-${e.id}`,
                  children: e.name,
                }),
                l.jsx("p", {
                  className: "text-sm text-muted-foreground truncate",
                  children: e.specialization,
                }),
                l.jsxs("div", {
                  className: "flex items-center gap-2 mt-2",
                  children: [
                    e.rating &&
                      l.jsxs("div", {
                        className: "flex items-center gap-1 text-sm",
                        children: [
                          l.jsx(ry, {
                            className:
                              "h-3.5 w-3.5 fill-yellow-400 text-yellow-400",
                          }),
                          l.jsx("span", {
                            className: "font-medium",
                            children: e.rating.toFixed(1),
                          }),
                        ],
                      }),
                    e.followers &&
                      l.jsxs("div", {
                        className:
                          "flex items-center gap-1 text-sm text-muted-foreground",
                        children: [
                          l.jsx(Or, { className: "h-3.5 w-3.5" }),
                          l.jsx("span", { children: e.followers }),
                        ],
                      }),
                  ],
                }),
              ],
            }),
          ],
        }),
        l.jsx("div", {
          className: "flex flex-wrap gap-1.5 mt-4",
          children: e.subjects
            .slice(0, 3)
            .map((o) =>
              l.jsx(
                _e,
                { variant: "secondary", className: "text-xs", children: o },
                o,
              ),
            ),
        }),
        l.jsxs("div", {
          className: "flex items-center gap-2 mt-3",
          children: [
            l.jsx(_e, {
              className: `text-xs ${vP[e.level]}`,
              children: e.level === "all" ? "All Levels" : e.level,
            }),
            l.jsx("span", {
              className: "text-xs text-muted-foreground",
              children: yP[e.teachingStyle],
            }),
          ],
        }),
        e.bio &&
          l.jsx("p", {
            className: "text-sm text-muted-foreground mt-3 line-clamp-2",
            children: e.bio,
          }),
      ],
    }),
  });
}
function wP() {
  return l.jsx(Te, {
    className: "overflow-hidden",
    children: l.jsxs(Re, {
      className: "p-4",
      children: [
        l.jsxs("div", {
          className: "flex items-start gap-4",
          children: [
            l.jsx("div", {
              className: "h-16 w-16 rounded-full bg-muted animate-pulse",
            }),
            l.jsxs("div", {
              className: "flex-1 space-y-2",
              children: [
                l.jsx("div", {
                  className: "h-5 w-32 bg-muted animate-pulse rounded",
                }),
                l.jsx("div", {
                  className: "h-4 w-24 bg-muted animate-pulse rounded",
                }),
                l.jsx("div", {
                  className: "h-4 w-16 bg-muted animate-pulse rounded",
                }),
              ],
            }),
          ],
        }),
        l.jsxs("div", {
          className: "flex gap-2 mt-4",
          children: [
            l.jsx("div", {
              className: "h-5 w-16 bg-muted animate-pulse rounded-full",
            }),
            l.jsx("div", {
              className: "h-5 w-16 bg-muted animate-pulse rounded-full",
            }),
          ],
        }),
      ],
    }),
  });
}
const SP = [
    { id: "all", label: "All Subjects" },
    { id: "Physics", label: "Physics" },
    { id: "Chemistry", label: "Chemistry" },
    { id: "Mathematics", label: "Mathematics" },
    { id: "Reasoning", label: "Reasoning" },
    { id: "English", label: "English" },
    { id: "General Studies", label: "General Studies" },
  ],
  bP = [
    { id: "all", label: "All Levels" },
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
  ],
  CP = [
    { id: "all", label: "All Styles" },
    { id: "conceptual", label: "Conceptual" },
    { id: "problem-solving", label: "Problem Solving" },
    { id: "exam-focused", label: "Exam Focused" },
    { id: "comprehensive", label: "Comprehensive" },
  ];
function NP() {
  const [e, t] = f.useState(""),
    [n, r] = f.useState(["all"]),
    [o, s] = f.useState(["all"]),
    [i, a] = f.useState(["all"]),
    { data: c, isLoading: u } = Ot({ queryKey: ["/api/educators"] }),
    d =
      c == null
        ? void 0
        : c.filter(
            (h) =>
              !(
                (e && !h.name.toLowerCase().includes(e.toLowerCase())) ||
                (!n.includes("all") &&
                  !h.subjects.some((S) => n.includes(S))) ||
                (!o.includes("all") && !o.includes(h.level)) ||
                (!i.includes("all") && !i.includes(h.teachingStyle))
              ),
          ),
    p = (h, x, S) => {
      S(
        h === "all"
          ? ["all"]
          : (v) => {
              const w = v.filter((g) => g !== "all");
              if (v.includes(h)) {
                const g = w.filter((m) => m !== h);
                return g.length === 0 ? ["all"] : g;
              }
              return [...w, h];
            },
      );
    };
  return l.jsxs("div", {
    className: "min-h-screen pb-20 md:pb-8",
    children: [
      l.jsx("div", {
        className: "bg-gradient-to-b from-primary/5 to-background py-12",
        children: l.jsxs("div", {
          className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          children: [
            l.jsxs("div", {
              className: "flex items-center gap-3 mb-4",
              children: [
                l.jsx("div", {
                  className:
                    "h-12 w-12 rounded-md bg-primary flex items-center justify-center",
                  children: l.jsx(Or, {
                    className: "h-6 w-6 text-primary-foreground",
                  }),
                }),
                l.jsxs("div", {
                  children: [
                    l.jsx("h1", {
                      className: "text-3xl font-bold",
                      "data-testid": "text-page-title",
                      children: "Educator Discovery",
                    }),
                    l.jsx("p", {
                      className: "text-muted-foreground",
                      children:
                        "Find the best educators for your learning style",
                    }),
                  ],
                }),
              ],
            }),
            l.jsx("div", {
              className: "max-w-md mt-6",
              children: l.jsxs("div", {
                className: "relative",
                children: [
                  l.jsx(ny, {
                    className:
                      "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
                  }),
                  l.jsx(Zd, {
                    type: "search",
                    placeholder: "Search educators by name...",
                    value: e,
                    onChange: (h) => t(h.target.value),
                    className: "pl-10",
                    "data-testid": "input-search-educators",
                  }),
                ],
              }),
            }),
          ],
        }),
      }),
      l.jsxs("div", {
        className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8",
        children: [
          l.jsxs("div", {
            className: "space-y-4 mb-8",
            children: [
              l.jsxs("div", {
                children: [
                  l.jsx("p", {
                    className: "text-sm font-medium mb-2",
                    children: "Subject",
                  }),
                  l.jsx(po, {
                    filters: SP,
                    selectedFilters: n,
                    onToggle: (h) => p(h, n, r),
                  }),
                ],
              }),
              l.jsxs("div", {
                children: [
                  l.jsx("p", {
                    className: "text-sm font-medium mb-2",
                    children: "Level",
                  }),
                  l.jsx(po, {
                    filters: bP,
                    selectedFilters: o,
                    onToggle: (h) => p(h, o, s),
                  }),
                ],
              }),
              l.jsxs("div", {
                children: [
                  l.jsx("p", {
                    className: "text-sm font-medium mb-2",
                    children: "Teaching Style",
                  }),
                  l.jsx(po, {
                    filters: CP,
                    selectedFilters: i,
                    onToggle: (h) => p(h, i, a),
                  }),
                ],
              }),
            ],
          }),
          l.jsxs("p", {
            className: "text-muted-foreground mb-6",
            children: [
              (d == null ? void 0 : d.length) || 0,
              " educators found",
            ],
          }),
          u
            ? l.jsx("div", {
                className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
                children: Array.from({ length: 6 }).map((h, x) =>
                  l.jsx(wP, {}, x),
                ),
              })
            : d && d.length > 0
              ? l.jsx("div", {
                  className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
                  children: d.map((h) => l.jsx(xP, { educator: h }, h.id)),
                })
              : l.jsxs("div", {
                  className: "text-center py-16",
                  children: [
                    l.jsx(Or, {
                      className: "h-16 w-16 mx-auto text-muted-foreground mb-4",
                    }),
                    l.jsx("p", {
                      className: "text-lg font-medium mb-2",
                      children: "No educators found",
                    }),
                    l.jsx("p", {
                      className: "text-muted-foreground",
                      children: "Try adjusting your filters",
                    }),
                  ],
                }),
        ],
      }),
    ],
  });
}
const EP = {
  exam: {
    icon: Xt,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    label: "Exam",
  },
  internship: {
    icon: Xv,
    color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    label: "Internship",
  },
  hackathon: {
    icon: qC,
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    label: "Hackathon",
  },
  scholarship: {
    icon: WC,
    color:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    label: "Scholarship",
  },
};
function jP(e) {
  const t = new Date(e),
    n = new Date(),
    r = t.getTime() - n.getTime(),
    o = Math.ceil(r / (1e3 * 60 * 60 * 24));
  return o < 0
    ? { text: "Expired", urgent: !1 }
    : o === 0
      ? { text: "Today!", urgent: !0 }
      : o === 1
        ? { text: "Tomorrow", urgent: !0 }
        : o <= 7
          ? { text: `${o} days left`, urgent: !0 }
          : o <= 30
            ? { text: `${o} days left`, urgent: !1 }
            : {
                text: t.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
                urgent: !1,
              };
}
function lw({ opportunity: e, isBookmarked: t, onToggleBookmark: n }) {
  const r = EP[e.type],
    o = r.icon,
    s = jP(e.deadline);
  return l.jsx(Te, {
    className: "overflow-visible",
    "data-testid": `card-deadline-${e.id}`,
    children: l.jsxs(Re, {
      className: "p-4",
      children: [
        l.jsxs("div", {
          className: "flex items-start justify-between gap-3",
          children: [
            l.jsxs("div", {
              className: "flex items-start gap-3 flex-1 min-w-0",
              children: [
                l.jsx("div", {
                  className: `h-10 w-10 rounded-md ${r.color} flex items-center justify-center shrink-0`,
                  children: l.jsx(o, { className: "h-5 w-5" }),
                }),
                l.jsxs("div", {
                  className: "flex-1 min-w-0",
                  children: [
                    l.jsxs("div", {
                      className: "flex items-center gap-2 flex-wrap",
                      children: [
                        l.jsx(_e, {
                          variant: "secondary",
                          className: `text-xs ${r.color}`,
                          children: r.label,
                        }),
                        s.urgent &&
                          l.jsx(_e, {
                            className:
                              "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-xs",
                            children: "Urgent",
                          }),
                      ],
                    }),
                    l.jsx("h3", {
                      className: "font-semibold mt-1.5 line-clamp-1",
                      "data-testid": `text-deadline-title-${e.id}`,
                      children: e.title,
                    }),
                    l.jsx("p", {
                      className:
                        "text-sm text-muted-foreground line-clamp-2 mt-1",
                      children: e.description,
                    }),
                    e.organization &&
                      l.jsx("p", {
                        className: "text-xs text-muted-foreground mt-1",
                        children: e.organization,
                      }),
                  ],
                }),
              ],
            }),
            l.jsxs("div", {
              className: "flex flex-col items-end gap-2 shrink-0",
              children: [
                l.jsxs("div", {
                  className: "flex items-center gap-1.5 text-sm",
                  children: [
                    l.jsx(yn, { className: "h-4 w-4 text-muted-foreground" }),
                    l.jsx("span", {
                      className: s.urgent
                        ? "font-medium text-red-600 dark:text-red-400"
                        : "text-muted-foreground",
                      children: s.text,
                    }),
                  ],
                }),
                n &&
                  l.jsx(we, {
                    variant: "ghost",
                    size: "icon",
                    onClick: () => n(e),
                    "data-testid": `button-bookmark-${e.id}`,
                    children: t
                      ? l.jsx(KC, { className: "h-5 w-5 text-primary" })
                      : l.jsx(zd, { className: "h-5 w-5" }),
                  }),
              ],
            }),
          ],
        }),
        (e.prize || e.url) &&
          l.jsxs("div", {
            className: "flex items-center justify-between mt-3 pt-3 border-t",
            children: [
              e.prize &&
                l.jsx("span", {
                  className:
                    "text-sm font-medium text-green-600 dark:text-green-400",
                  children: e.prize,
                }),
              e.url &&
                l.jsx(we, {
                  variant: "ghost",
                  size: "sm",
                  asChild: !0,
                  children: l.jsxs("a", {
                    href: e.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    "data-testid": `link-deadline-${e.id}`,
                    children: [
                      "Learn more",
                      l.jsx(ey, { className: "h-3.5 w-3.5 ml-1" }),
                    ],
                  }),
                }),
            ],
          }),
      ],
    }),
  });
}
function kP() {
  return l.jsx(Te, {
    className: "overflow-hidden",
    children: l.jsx(Re, {
      className: "p-4",
      children: l.jsxs("div", {
        className: "flex items-start gap-3",
        children: [
          l.jsx("div", {
            className: "h-10 w-10 rounded-md bg-muted animate-pulse shrink-0",
          }),
          l.jsxs("div", {
            className: "flex-1 space-y-2",
            children: [
              l.jsx("div", {
                className: "h-5 w-20 bg-muted animate-pulse rounded-full",
              }),
              l.jsx("div", {
                className: "h-5 w-full bg-muted animate-pulse rounded",
              }),
              l.jsx("div", {
                className: "h-4 w-3/4 bg-muted animate-pulse rounded",
              }),
            ],
          }),
        ],
      }),
    }),
  });
}
const PP = [
  { id: "all", label: "All" },
  { id: "exam", label: "Exams" },
  { id: "internship", label: "Internships" },
  { id: "hackathon", label: "Hackathons" },
  { id: "scholarship", label: "Scholarships" },
];
function TP() {
  const [e, t] = f.useState(["all"]),
    { data: n, isLoading: r } = Ot({ queryKey: ["/api/opportunities"] }),
    { data: o } = Ot({ queryKey: ["/api/bookmarks"] }),
    s = Sv({
      mutationFn: async (u) => {
        const d =
          o == null
            ? void 0
            : o.find((p) => p.type === "opportunity" && p.itemId === u.id);
        d
          ? await pu("DELETE", `/api/bookmarks/${d.id}`)
          : await pu("POST", "/api/bookmarks", {
              type: "opportunity",
              itemId: u.id,
            });
      },
      onSuccess: () => {
        Od.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      },
    }),
    i = (u) => {
      t(
        u === "all"
          ? ["all"]
          : (d) => {
              const p = d.filter((h) => h !== "all");
              if (d.includes(u)) {
                const h = p.filter((x) => x !== u);
                return h.length === 0 ? ["all"] : h;
              }
              return [...p, u];
            },
      );
    },
    a =
      n == null
        ? void 0
        : n
            .filter((u) => !(!e.includes("all") && !e.includes(u.type)))
            .sort(
              (u, d) =>
                new Date(u.deadline).getTime() - new Date(d.deadline).getTime(),
            ),
    c = (u) =>
      o == null
        ? void 0
        : o.some((d) => d.type === "opportunity" && d.itemId === u);
  return l.jsxs("div", {
    className: "min-h-screen pb-20 md:pb-8",
    children: [
      l.jsx("div", {
        className: "bg-gradient-to-b from-primary/5 to-background py-12",
        children: l.jsx("div", {
          className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          children: l.jsxs("div", {
            className: "flex items-center gap-3 mb-4",
            children: [
              l.jsx("div", {
                className:
                  "h-12 w-12 rounded-md bg-primary flex items-center justify-center",
                children: l.jsx(yn, {
                  className: "h-6 w-6 text-primary-foreground",
                }),
              }),
              l.jsxs("div", {
                children: [
                  l.jsx("h1", {
                    className: "text-3xl font-bold",
                    "data-testid": "text-page-title",
                    children: "Deadline Tracker",
                  }),
                  l.jsx("p", {
                    className: "text-muted-foreground",
                    children: "Never miss an important deadline again",
                  }),
                ],
              }),
            ],
          }),
        }),
      }),
      l.jsxs("div", {
        className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8",
        children: [
          l.jsxs("div", {
            className: "mb-8",
            children: [
              l.jsx("p", {
                className: "text-sm font-medium mb-2",
                children: "Filter by Type",
              }),
              l.jsx(po, { filters: PP, selectedFilters: e, onToggle: i }),
            ],
          }),
          l.jsxs("p", {
            className: "text-muted-foreground mb-6",
            children: [
              (a == null ? void 0 : a.length) || 0,
              " upcoming deadlines",
            ],
          }),
          r
            ? l.jsx("div", {
                className: "space-y-4",
                children: Array.from({ length: 5 }).map((u, d) =>
                  l.jsx(kP, {}, d),
                ),
              })
            : a && a.length > 0
              ? l.jsx("div", {
                  className: "space-y-4",
                  children: a.map((u) =>
                    l.jsx(
                      lw,
                      {
                        opportunity: u,
                        isBookmarked: c(u.id),
                        onToggleBookmark: (d) => s.mutate(d),
                      },
                      u.id,
                    ),
                  ),
                })
              : l.jsxs("div", {
                  className: "text-center py-16",
                  children: [
                    l.jsx(yn, {
                      className: "h-16 w-16 mx-auto text-muted-foreground mb-4",
                    }),
                    l.jsx("p", {
                      className: "text-lg font-medium mb-2",
                      children: "No upcoming deadlines",
                    }),
                    l.jsx("p", {
                      className: "text-muted-foreground",
                      children: "Check back later for new opportunities",
                    }),
                  ],
                }),
        ],
      }),
    ],
  });
}
function RP() {
  const { data: e, isLoading: t } = Ot({ queryKey: ["/api/bookmarks"] }),
    { data: n } = Ot({ queryKey: ["/api/courses"] }),
    { data: r } = Ot({ queryKey: ["/api/opportunities"] }),
    o = Sv({
      mutationFn: async (d) => {
        await pu("DELETE", `/api/bookmarks/${d}`);
      },
      onSuccess: () => {
        Od.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      },
    }),
    s = (e == null ? void 0 : e.filter((d) => d.type === "course")) || [],
    i = (e == null ? void 0 : e.filter((d) => d.type === "opportunity")) || [],
    a = () =>
      s
        .map((d) => ({
          bookmark: d,
          course: n == null ? void 0 : n.find((p) => p.id === d.itemId),
        }))
        .filter((d) => d.course),
    c = () =>
      i
        .map((d) => ({
          bookmark: d,
          opportunity: r == null ? void 0 : r.find((p) => p.id === d.itemId),
        }))
        .filter((d) => d.opportunity),
    u = (d) => {
      const p =
        e == null
          ? void 0
          : e.find((h) => h.type === "opportunity" && h.itemId === d);
      p && o.mutate(p.id);
    };
  return l.jsxs("div", {
    className: "min-h-screen pb-20 md:pb-8",
    children: [
      l.jsx("div", {
        className: "bg-gradient-to-b from-primary/5 to-background py-12",
        children: l.jsx("div", {
          className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          children: l.jsxs("div", {
            className: "flex items-center gap-3 mb-4",
            children: [
              l.jsx("div", {
                className:
                  "h-12 w-12 rounded-md bg-primary flex items-center justify-center",
                children: l.jsx(zd, {
                  className: "h-6 w-6 text-primary-foreground",
                }),
              }),
              l.jsxs("div", {
                children: [
                  l.jsx("h1", {
                    className: "text-3xl font-bold",
                    "data-testid": "text-page-title",
                    children: "My Bookmarks",
                  }),
                  l.jsx("p", {
                    className: "text-muted-foreground",
                    children: "Your saved courses and deadlines",
                  }),
                ],
              }),
            ],
          }),
        }),
      }),
      l.jsx("div", {
        className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8",
        children: l.jsxs(G0, {
          defaultValue: "courses",
          className: "w-full",
          children: [
            l.jsxs(vf, {
              className: "mb-6",
              children: [
                l.jsxs(mr, {
                  value: "courses",
                  className: "gap-2",
                  "data-testid": "tab-courses",
                  children: [
                    l.jsx(Bs, { className: "h-4 w-4" }),
                    "Courses (",
                    s.length,
                    ")",
                  ],
                }),
                l.jsxs(mr, {
                  value: "deadlines",
                  className: "gap-2",
                  "data-testid": "tab-deadlines",
                  children: [
                    l.jsx(yn, { className: "h-4 w-4" }),
                    "Deadlines (",
                    i.length,
                    ")",
                  ],
                }),
              ],
            }),
            l.jsx(gr, {
              value: "courses",
              children: t
                ? l.jsx("div", {
                    className: "text-center py-8",
                    children: "Loading...",
                  })
                : a().length > 0
                  ? l.jsx("div", {
                      className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
                      children: a().map(({ bookmark: d, course: p }) =>
                        l.jsxs(
                          "div",
                          {
                            className: "relative",
                            children: [
                              l.jsx(ef, { course: p }),
                              l.jsx(we, {
                                variant: "ghost",
                                size: "icon",
                                className: "absolute top-2 right-2",
                                onClick: () => o.mutate(d.id),
                                "data-testid": `button-remove-bookmark-${p.id}`,
                                children: l.jsx(oN, {
                                  className: "h-4 w-4 text-destructive",
                                }),
                              }),
                            ],
                          },
                          d.id,
                        ),
                      ),
                    })
                  : l.jsxs("div", {
                      className: "text-center py-16",
                      children: [
                        l.jsx(Bs, {
                          className:
                            "h-16 w-16 mx-auto text-muted-foreground mb-4",
                        }),
                        l.jsx("p", {
                          className: "text-lg font-medium mb-2",
                          children: "No saved courses",
                        }),
                        l.jsx("p", {
                          className: "text-muted-foreground",
                          children:
                            "Bookmark courses while browsing to save them here",
                        }),
                      ],
                    }),
            }),
            l.jsx(gr, {
              value: "deadlines",
              children: t
                ? l.jsx("div", {
                    className: "text-center py-8",
                    children: "Loading...",
                  })
                : c().length > 0
                  ? l.jsx("div", {
                      className: "space-y-4",
                      children: c().map(({ bookmark: d, opportunity: p }) =>
                        l.jsx(
                          lw,
                          {
                            opportunity: p,
                            isBookmarked: !0,
                            onToggleBookmark: () => u(p.id),
                          },
                          d.id,
                        ),
                      ),
                    })
                  : l.jsxs("div", {
                      className: "text-center py-16",
                      children: [
                        l.jsx(yn, {
                          className:
                            "h-16 w-16 mx-auto text-muted-foreground mb-4",
                        }),
                        l.jsx("p", {
                          className: "text-lg font-medium mb-2",
                          children: "No saved deadlines",
                        }),
                        l.jsx("p", {
                          className: "text-muted-foreground",
                          children:
                            "Bookmark deadlines from the Deadline Tracker to save them here",
                        }),
                      ],
                    }),
            }),
          ],
        }),
      }),
    ],
  });
}
const aw = f.forwardRef(({ className: e, ...t }, n) =>
  l.jsx("textarea", {
    className: q(
      "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      e,
    ),
    ref: n,
    ...t,
  }),
);
aw.displayName = "Textarea";
const AP = [
  "What is GATE exam?",
  "Compare JEE vs GATE",
  "Best courses for UPSC",
  "How to prepare for CAT?",
];
function _P({ className: e }) {
  const [t, n] = f.useState([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi! I'm your AI Study Helper. I can help you understand exams, compare courses, and suggest the best learning resources. What would you like to know?",
        timestamp: new Date().toISOString(),
      },
    ]),
    [r, o] = f.useState(""),
    [s, i] = f.useState(!1),
    a = f.useRef(null),
    c = f.useRef(null);
  f.useEffect(() => {
    a.current && (a.current.scrollTop = a.current.scrollHeight);
  }, [t]);
  const u = async () => {
      if (!r.trim() || s) return;
      const h = {
        id: `user-${Date.now()}`,
        role: "user",
        content: r.trim(),
        timestamp: new Date().toISOString(),
      };
      (n((x) => [...x, h]), o(""), i(!0));
      try {
        const x = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: h.content }),
        });
        if (x.ok) {
          const S = await x.json(),
            v = {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: S.response,
              timestamp: new Date().toISOString(),
            };
          n((w) => [...w, v]);
        } else {
          const S = {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again later.",
            timestamp: new Date().toISOString(),
          };
          n((v) => [...v, S]);
        }
      } catch {
        const S = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting. Please check your internet connection and try again.",
          timestamp: new Date().toISOString(),
        };
        n((v) => [...v, S]);
      } finally {
        i(!1);
      }
    },
    d = (h) => {
      h.key === "Enter" && !h.shiftKey && (h.preventDefault(), u());
    },
    p = (h) => {
      var x;
      (o(h), (x = c.current) == null || x.focus());
    };
  return l.jsxs("div", {
    className: `flex flex-col h-full ${e}`,
    children: [
      l.jsxs("div", {
        className: "flex items-center gap-3 p-4 border-b",
        children: [
          l.jsx("div", {
            className:
              "h-10 w-10 rounded-md bg-primary flex items-center justify-center",
            children: l.jsx(Cl, {
              className: "h-5 w-5 text-primary-foreground",
            }),
          }),
          l.jsxs("div", {
            children: [
              l.jsx("h2", {
                className: "font-semibold",
                children: "AI Study Helper",
              }),
              l.jsx("p", {
                className: "text-sm text-muted-foreground",
                children: "Ask anything about exams & courses",
              }),
            ],
          }),
        ],
      }),
      l.jsx(sf, {
        className: "flex-1 p-4",
        ref: a,
        children: l.jsxs("div", {
          className: "space-y-4",
          children: [
            t.map((h) =>
              l.jsxs(
                "div",
                {
                  className: `flex gap-3 ${h.role === "user" ? "flex-row-reverse" : ""}`,
                  "data-testid": `chat-message-${h.id}`,
                  children: [
                    l.jsx(_l, {
                      className: "h-8 w-8 shrink-0",
                      children: l.jsx(Ol, {
                        className:
                          h.role === "assistant"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted",
                        children:
                          h.role === "assistant"
                            ? l.jsx(Yp, { className: "h-4 w-4" })
                            : l.jsx(sN, { className: "h-4 w-4" }),
                      }),
                    }),
                    l.jsx("div", {
                      className: `rounded-lg px-4 py-2.5 max-w-[80%] ${h.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`,
                      children: l.jsx("p", {
                        className: "text-sm whitespace-pre-wrap",
                        children: h.content,
                      }),
                    }),
                  ],
                },
                h.id,
              ),
            ),
            s &&
              l.jsxs("div", {
                className: "flex gap-3",
                children: [
                  l.jsx(_l, {
                    className: "h-8 w-8 shrink-0",
                    children: l.jsx(Ol, {
                      className: "bg-primary text-primary-foreground",
                      children: l.jsx(Yp, { className: "h-4 w-4" }),
                    }),
                  }),
                  l.jsx("div", {
                    className: "rounded-lg px-4 py-2.5 bg-muted",
                    children: l.jsx(qp, { className: "h-4 w-4 animate-spin" }),
                  }),
                ],
              }),
          ],
        }),
      }),
      t.length <= 1 &&
        l.jsxs("div", {
          className: "px-4 pb-2",
          children: [
            l.jsx("p", {
              className: "text-xs text-muted-foreground mb-2",
              children: "Try asking:",
            }),
            l.jsx("div", {
              className: "flex flex-wrap gap-2",
              children: AP.map((h) =>
                l.jsx(
                  _e,
                  {
                    variant: "secondary",
                    className: "cursor-pointer hover-elevate",
                    onClick: () => p(h),
                    "data-testid": `button-quick-prompt-${h.replace(/\s+/g, "-").toLowerCase()}`,
                    children: h,
                  },
                  h,
                ),
              ),
            }),
          ],
        }),
      l.jsx("div", {
        className: "p-4 border-t",
        children: l.jsxs("div", {
          className: "flex gap-2",
          children: [
            l.jsx(aw, {
              ref: c,
              value: r,
              onChange: (h) => o(h.target.value),
              onKeyDown: d,
              placeholder: "Ask about exams, courses, or study tips...",
              className: "min-h-[44px] max-h-32 resize-none",
              rows: 1,
              disabled: s,
              "data-testid": "input-chat",
            }),
            l.jsx(we, {
              size: "icon",
              onClick: u,
              disabled: !r.trim() || s,
              "data-testid": "button-send-chat",
              children: s
                ? l.jsx(qp, { className: "h-4 w-4 animate-spin" })
                : l.jsx(tN, { className: "h-4 w-4" }),
            }),
          ],
        }),
      }),
    ],
  });
}
function OP() {
  return l.jsx("div", {
    className: "h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] pb-16 md:pb-0",
    children: l.jsx(_P, { className: "h-full" }),
  });
}
function IP() {
  return l.jsx("div", {
    className:
      "min-h-screen w-full flex items-center justify-center bg-gray-50",
    children: l.jsx(Te, {
      className: "w-full max-w-md mx-4",
      children: l.jsxs(Re, {
        className: "pt-6",
        children: [
          l.jsxs("div", {
            className: "flex mb-4 gap-2",
            children: [
              l.jsx(GC, { className: "h-8 w-8 text-red-500" }),
              l.jsx("h1", {
                className: "text-2xl font-bold text-gray-900",
                children: "404 Page Not Found",
              }),
            ],
          }),
          l.jsx("p", {
            className: "mt-4 text-sm text-gray-600",
            children: "Did you forget to add the page to the router?",
          }),
        ],
      }),
    }),
  });
}
function MP() {
  return l.jsxs(hb, {
    children: [
      l.jsx(Cn, { path: "/", component: Rj }),
      l.jsx(Cn, { path: "/search", component: z2 }),
      l.jsx(Cn, { path: "/exam/:id", component: nP }),
      l.jsx(Cn, { path: "/educators", component: NP }),
      l.jsx(Cn, { path: "/deadlines", component: TP }),
      l.jsx(Cn, { path: "/bookmarks", component: RP }),
      l.jsx(Cn, { path: "/chat", component: OP }),
      l.jsx(Cn, { component: IP }),
    ],
  });
}
function LP() {
  return l.jsx(yj, {
    defaultTheme: "light",
    storageKey: "edura-theme",
    children: l.jsx(Ib, {
      client: Od,
      children: l.jsxs(mj, {
        children: [
          l.jsxs("div", {
            className: "min-h-screen bg-background",
            children: [
              l.jsx(bj, {}),
              l.jsx("main", { children: l.jsx(MP, {}) }),
              l.jsx(Cj, {}),
            ],
          }),
          l.jsx(BN, {}),
        ],
      }),
    }),
  });
}
Gg(document.getElementById("root")).render(l.jsx(LP, {}));
