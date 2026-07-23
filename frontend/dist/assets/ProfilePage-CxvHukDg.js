import{c as i,a as m,r as x,j as e,A as h,B as t}from"./index-x3UyloLK.js";import{C as d}from"./Card-CMiKvsFv.js";import{I as s}from"./Input-C1sJ5VUK.js";/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]],j=i("mail",p);/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],u=i("shield-check",f);/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["circle",{cx:"12",cy:"8",r:"5",key:"1hypcn"}],["path",{d:"M20 21a8 8 0 0 0-16 0",key:"rfgkzh"}]],y=i("user-round",N);function w(){var r,c,n,o;const{user:a}=m(),[l]=x.useState({fullName:((r=a==null?void 0:a.profile)==null?void 0:r.fullName)||"",timezone:((c=a==null?void 0:a.profile)==null?void 0:c.timezone)||"",bio:((n=a==null?void 0:a.profile)==null?void 0:n.bio)||""});return e.jsxs("div",{className:"mx-auto max-w-4xl space-y-6",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-semibold text-white",children:"Profile"}),e.jsx("p",{className:"mt-2 text-sm text-slate-400",children:"Review your account details and preferences."})]}),e.jsx(d,{children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(h,{name:l.fullName||"Traveler",imageUrl:(o=a==null?void 0:a.profile)==null?void 0:o.avatarUrl}),e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-semibold text-white",children:l.fullName||"Traveler"}),e.jsx("div",{className:"text-sm text-slate-400",children:a==null?void 0:a.roleName})]})]})}),e.jsxs(d,{children:[e.jsxs("div",{className:"grid gap-4 md:grid-cols-2",children:[e.jsx(s,{label:"Full name",value:l.fullName,readOnly:!0}),e.jsx(s,{label:"Email",value:(a==null?void 0:a.email)||"",readOnly:!0}),e.jsx(s,{label:"Timezone",value:l.timezone,readOnly:!0}),e.jsx(s,{label:"Role",value:(a==null?void 0:a.roleName)||"",readOnly:!0}),e.jsxs("label",{className:"block space-y-2 md:col-span-2",children:[e.jsx("span",{className:"text-sm font-medium text-slate-200",children:"Bio"}),e.jsx("textarea",{value:l.bio,readOnly:!0,rows:4,className:"w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none"})]})]}),e.jsxs("div",{className:"mt-5 flex flex-wrap gap-3",children:[e.jsxs(t,{variant:"secondary",children:[e.jsx(y,{className:"h-4 w-4"})," Edit profile"]}),e.jsxs(t,{variant:"secondary",children:[e.jsx(j,{className:"h-4 w-4"})," Change email"]}),e.jsxs(t,{variant:"secondary",children:[e.jsx(u,{className:"h-4 w-4"})," Security settings"]})]})]})]})}export{w as default};
