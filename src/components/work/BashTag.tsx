import React from "react";
import "@/styles/BashTag.css";

const DEFAULT_STRING_IMAGE =
  "https://framerusercontent.com/images/hRZhO7eXhzBNm1BR1adsCCBzNI.png?width=329&height=390";

const DEFAULT_ICON_IMAGE =
  "https://framerusercontent.com/images/w8s7P5nmdg1ugki7c2YmcKGxU.png?width=199&height=199";

export default function BashTag({
  percentage = "80%",
  stringImage = DEFAULT_STRING_IMAGE,
  iconImage = DEFAULT_ICON_IMAGE,
}) {
  return (
    <div className="bash-tag">
      <div className="bash-tag__left">
        <div className="bash-tag__left-back" />
        <div className="bash-tag__left-front">
          <div className="bash-tag__string">
            <img src={stringImage} alt="" />
          </div>

          <div className="bash-tag__content">
            <div className="bash-tag__icons">
              <span className="bash-tag__icon">
                <img src={iconImage} alt="" />
              </span>
              <span className="bash-tag__icon">
                <img src={iconImage} alt="" />
              </span>
              <span className="bash-tag__icon">
                <img src={iconImage} alt="" />
              </span>
            </div>

            <p className="bash-tag__percentage">{percentage}</p>
          </div>
        </div>
      </div>

      <div className="bash-tag__right" />
    </div>
  );
}