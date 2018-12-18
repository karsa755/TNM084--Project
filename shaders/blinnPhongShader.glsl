vec3 BlinnPhongShading(vec3 V, vec3 L, vec3 N)
{
	vec3 diffuseColor = vec3(0.5, 0.5, 0.5); // light from sun color
	vec3 specularColor = vec3(0.8, 0.8, 0.8);
    float n = 20.0;   
	n *= 4.0; //this is done to make n behave more like normal phong
	float dotNL = max(dot(N, L), 0.0); 
	float dotNH = 0.0;
	if(dotNL > 0.0)
	{
		vec3 H = normalize(L + V); // halfway vector, blinn phong method instead of classic R * V
		dotNH = pow(max(dot(N, H), 0.0), n); 
	}
                          
	vec3 shadedcolor = diffuseColor * dotNL + specularColor * dotNH;
	
	return shadedcolor;
}
