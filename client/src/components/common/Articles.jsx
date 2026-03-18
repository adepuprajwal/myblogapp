import {useState,useEffect} from 'react' ;
import axios from 'axios' ;
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react' ;

function Articles() {

  const navigate = useNavigate();
  const [articles,setArticles] = useState([]);
  const [error,setError] = useState('');
  const {getToken} = useAuth();

  // get all articles
  async function getArticles(){

    //  get jwt token
    const token = await getToken()

    // make authenticated request
    let res = await axios.get('http://localhost:3000/author-api/articles',{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    if(res.data.message==='articles'){
      setArticles(res.data.payload);
    }else{
      setError(res.data.message);
    }
  }

  // goto specific article
  function gotoArticleById(articleObj){
    navigate(`../${articleObj.articleId}`,{state:articleObj})
  }

  useEffect(()=>{
    getArticles()
  })


  return (
    <div className='container'>
      <div>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
          {
            articles.map((articleObj) => <div className="col my-3" key={articleObj.articleId} >
              <div className="card" style={{height:'100px'}} >
                <div className="card-body bg-white">
                  <div className='d-grid justify-content-end align-items-center text-center'>
                    <img src={articleObj.authorData.profileImageUrl} 
                    width='40px' 
                    className='rounded-circle' 
                    alt="profile pic" />
                    <p className="lead">
                      <small>
                        {articleObj.authorData.nameOfAuthor}
                      </small>
                    </p>
                  </div>
                  <h5 className="card-title">{articleObj.title}</h5>
                  <p className="card-text">
                    { articleObj.content.substring(0,80)+"...." }
                  </p>
                  <button className="btn btn-primary" onClick={()=>gotoArticleById(articleObj)} >
                    Read more
                  </button>
                </div>
                <div className="card-footer bg-light">
                  <p>
                    last modified on:{articleObj.dateOfModification}
                  </p>
                </div>
              </div>
            </div> )
          }
        </div>
      </div>
    </div>
  )
}

export default Articles