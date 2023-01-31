(()=>{"use strict";const t=document.querySelector(".body"),e=document.createElement("div"),n=document.createElement("div"),d=document.createElement("div"),s=document.createElement("div"),i=document.createElement("div"),a=document.createElement("div"),l=document.createElement("div");let o,c;function r(t){const e=document.createElement("button");e.classList.add("btn"),e.textContent=t,n.appendChild(e)}function m(t){const e=document.createElement("div"),n=document.createElement("div"),s=document.createElement("div");e.classList.add(t),n.classList.add(`${t}__title`),s.classList.add(`${t}__text`),n.textContent=t+":",d.appendChild(e),e.appendChild(n),e.appendChild(s)}function u(t){const e=document.createElement("div");e.classList.add("other-size__text"),e.classList.add(t),e.textContent=t,l.appendChild(e)}n.classList.add("buttons"),e.classList.add("container"),t.appendChild(e),e.appendChild(n),d.classList.add("stats"),e.appendChild(d),s.classList.add("tiles"),e.appendChild(s),i.classList.add("sizes"),e.appendChild(i),r("start"),r("stop"),r("save"),r("results"),m("moves"),m("time"),function(t){let e=0,n=0;o=[];for(let t=0;t<16;t++)o.push(t);let d=o.concat();c=d.sort((()=>Math.random()-.5));for(let t=0;t<16;t++){const d=document.createElement("div");d.classList.add("tile"),d.textContent=c[t],d.style.top=n+"px",d.style.left=e+"px",e+=100,0==d.textContent&&(d.style.fontSize=0),s.appendChild(d),(t+1)%4==0&&0!==t&&(e=0,n+=100)}}(),function(){const t=document.createElement("div"),e=document.createElement("div"),n=document.createElement("div"),d=document.createElement("div");a.appendChild(t),a.appendChild(e),l.appendChild(n),l.appendChild(d),t.textContent="Frame size:",n.textContent="Other sizes:",a.classList.add("frame-size"),l.classList.add("other-size"),t.classList.add("frame-size__title"),n.classList.add("other-size__title"),i.appendChild(a),i.appendChild(l)}(),u("3x3"),u("4x4"),u("5x5"),u("6x6"),u("7x7"),u("8x8"),function(t){const e=document.createElement("div");e.classList.add("frame-size__text"),e.textContent="4x4",a.appendChild(e)}(),function(){let t,e={};const n=document.querySelectorAll(".tile"),d=Array.from(n).find((t=>0==t.textContent));function s(){c.forEach(((t,s)=>{if(t==d.textContent){for(const t in e)e[t]&&e[t].removeAttribute("draggable","true");let t=c.findIndex((t=>t==c[s-1]))%4==3,d=c.findIndex((t=>t==c[s+1]))%4==0;e.leftElement=d?null:Array.from(n).find((t=>t.textContent==c[s+1])),e.rightElement=t?null:Array.from(n).find((t=>t.textContent==c[s-1])),e.topElement=Array.from(n).find((t=>t.textContent==c[s-4])),e.bottomElement=Array.from(n).find((t=>t.textContent==c[s+4]));for(const t in e)e[t]&&e[t].setAttribute("draggable","true")}}))}function i(){t=this,t.hasAttribute("draggable")&&this.classList.add("active")}function a(t){this==d&&t.preventDefault()}function l(){if(!t.hasAttribute("draggable"))return;const e=t.style.left,n=t.style.top,i=d.style.left,a=d.style.top,l=c.indexOf(Number(t.textContent)),r=c.indexOf(Number(d.textContent));c.splice(l,1,Number(d.textContent)),c.splice(r,1,Number(t.textContent)),t.style.left=i,t.style.top=a,d.style.left=e,d.style.top=n,t.classList.remove("active"),s(),o.slice(1).toString()==c.slice(0,-1).toString()&&console.log("Game is finished")}d.style.backgroundImage="none",d.style.backgroundColor="#fff",s(),n.forEach((t=>{t.addEventListener("dragstart",i),t.addEventListener("dragover",a),t.addEventListener("drop",l),t.addEventListener("click",i),t.addEventListener("click",l)}))}()})();