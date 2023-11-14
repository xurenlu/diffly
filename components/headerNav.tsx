export default function HeaderNav() {
  return <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost  text-xl" style={{display:"inline-block","textTransform": "none"}}>
              <img src="/logo.png" width="40" className={"mr-2"} alt="logo of diffly" style={{"display": "inline-block"}}/>
              Api diff
          </a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">

              <li><a href="/">首页 </a></li>
              <li><a href="/run">手工执行 </a></li>
              <li><a href="/http_log">日志</a></li>
                <li><a href="/cookies">Cookies</a></li>
              <li>
                  <details>
                      <summary>
                          todo...
                      </summary>

                  </details>
              </li>
          </ul>
        </div>
    </div>
  </>;
}
