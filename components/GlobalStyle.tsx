/** @jsx h */
import { h } from 'preact'

export default function GlobalStyle() {
  return (
    <style>
      {`
  a {
    text-decoration: underline;
    text-decoration-thickness: 2px;
  }
  a:hover {
    text-decoration: none;
  }
  `}
    </style>
  )
}
