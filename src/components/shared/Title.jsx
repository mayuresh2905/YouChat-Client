import React from 'react';
import { Helmet} from "react-helmet-async"

const Title = ({title="YouChat",description="This is the Chat app called YouChat"}) => {
  return (
   <Helmet>
    <title>{title}</title>
    <meta name = "description" content={description} />
   </Helmet>
  )
}

export default Title