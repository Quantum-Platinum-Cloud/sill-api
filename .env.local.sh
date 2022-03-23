#!/bin/bash

export CONFIGURATION=$(cat << EOF
{
	"keycloakParams": {
		"url": "https://etalab-auth.lab.sspcloud.fr/auth",
		"realm": "etalab",
		"clientId": "sill"
	},
	"jwtClaims": {
		"email": "email",
		"familyName": "family_name",
		"firstName": "given_name",
		"username": "preferred_username",
		"groups": "groups",
		"locale": "locale"
	},
    "dataRepoUrl": "https://github.com/etalab/sill-data",
	"githubPersonalAccessToken": { 
		/* This env need to be defined in your .bashrc */
		"envName": "GITHUB_TOKEN" 
	},
    "githubWebhookSecret": "NO VERIFY",
	"port": 8080
}
EOF
) 

export ENVIRONNEMENT="development"

$@