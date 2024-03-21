import { useContext, useEffect } from "react";

function CreatePost(){
	return <div>
		<div>Create post page</div>
		<div>
			<form>
				<div>
					<textarea className="w-100" placeholder="What's on your mind"></textarea>
				</div>
			</form>
		</div>
	</div>
}

export default CreatePost;
