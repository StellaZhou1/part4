const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
    const total = blogs.reduce((total, blog) => { return total+blog.likes },0)
    return total
  }

const favoriteBlog = (blogs) => {
    const maxBlog = blogs.reduce((tempBlog, blog) => { return tempBlog.likes>blog.likes? tempBlog : blog},{likes:-1})
    return {
        title:maxBlog.title,
        author:maxBlog.author,
        likes:maxBlog.likes
    }
  }

const mostBlogs = (blogs) => {
    let autherObj = {}
    blogs.forEach((blog)=>{
        if(autherObj[blog.author]){
            autherObj[blog.author]+=1
        }
        else{
            autherObj[blog.author]=1
        }
    })
    const autherListTmp = Object.entries(autherObj)
    let autherList = []
    autherListTmp.forEach((auther)=>{
        autherList.push({author:auther[0],blogs:auther[1]})
    })
    const maxAuthor = autherList.reduce((tempAuthor, author) => 
    { return tempAuthor.blogs>author.blogs? tempAuthor : author},{author:"starter",blogs:-1})
    return maxAuthor
}

const mostLikes = (blogs) => {
    let autherObj = {}
    blogs.forEach((blog)=>{
        if(autherObj[blog.author]){
            autherObj[blog.author]+=blog.likes
        }
        else{
            autherObj[blog.author]=blog.likes
        }
    })
    const autherListTmp = Object.entries(autherObj)
    let autherList = []
    autherListTmp.forEach((auther)=>{
        autherList.push({author:auther[0],likes:auther[1]})
    })
    const maxAuthor = autherList.reduce((tempAuthor, author) => 
    { return tempAuthor.likes>author.likes? tempAuthor : author},{author:"starter",likes:-1})
    return maxAuthor
}

module.exports = {
dummy,
totalLikes,
favoriteBlog,
mostBlogs,
mostLikes
}