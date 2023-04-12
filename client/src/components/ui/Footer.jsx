import React from 'react'
import footerLib from '../../libs/ui/footer'
import gmailLogo from '../../assets/images/gmail-logo.svg'
import facebookLogo from '../../assets/images/facebook.svg'
import zaloLogo from '../../assets/images/zalo.svg'
import youtubeLogo from '../../assets/images/youtube.svg'
import certificate from "../../assets/images/certificate.png"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <div className="footer-bottom__main bg-[#1a1e20] text-white px-2">
          <div className="w-[75rem] m-auto py-8 max-w-full">
            <div className="flex justify-between w-full flex-col lg:flex-row gap-12 flex-wrap">
                <div className="flex flex-col gap-5 flex-1">
                  <ul>
                    <div className="font-bold text-green-400">{footerLib.companyName}</div>
                    <div className="mt-2 flex flex-col gap-1 text-sm text-zinc-300">
                      {(footerLib.companyAddress).map(address =>{
                        return(
                          <React.Fragment key={address.content}>
                          <li>{address.content}</li>
                          </React.Fragment>
                        )
                      })}
                    </div>
                  </ul>
                  <ul>
                    <div className="font-bold text-green-400">{footerLib.nameInfo}</div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-zinc-300">
                      {(footerLib.infoItems).map(info=>{
                          return(
                            <React.Fragment key={info.content}>
                              <Link to={info.link}>{info.content}</Link>
                            </React.Fragment>
                          )
                      })}
                    </div>
                  </ul>
                </div>
                <div className="flex flex-col flex-1 items-center gap-5">
                    <div className="font-bold text-green-400">{footerLib.contactTitle}</div>
                    <div className="flex gap-3 items-center">
                      <img src={gmailLogo} alt="" width="32" className="cursor-pointer"/>
                      <img src={facebookLogo} alt="" width="32" className="cursor-pointer" />
                      <img src={zaloLogo} alt="" width="32" className="cursor-pointer" />
                      <img src={youtubeLogo} alt="" width="32" className="cursor-pointer" />
                    </div>
                    <img src={certificate} alt="" />
                </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer