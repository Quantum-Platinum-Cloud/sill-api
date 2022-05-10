import type { SoftwareRow } from "../model/types";
import { z } from "zod";
import * as fs from "fs";
import { join as pathJoin } from "path";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";

/*

This script is meant to help edit and make sure it is well formatted sill-data/software.json

cd ~/github/sill-api && npx tsc -w
cd ~/github/sill-data 
node ../sill-api/dist/bin/edit.js

*/

const softwareFilePath = pathJoin(process.cwd(), "software.json");

const zSoftwareRef = z.union([
    z.object({
        "isKnown": z.literal(true),
        "softwareId": z.number(),
    }),
    z.object({
        "isKnown": z.literal(false),
        "softwareName": z.string(),
    }),
]);

const zSoftwareRow = z.object({
    "id": z.number(),
    "name": z.string(),
    "function": z.string(),
    "referencedSinceTime": z.number(),
    "dereferencing": z
        .object({
            "reason": z.string().optional(),
            "time": z.number(),
            "lastRecommendedVersion": z.string().optional(),
        })
        .optional(),
    "isStillInObservation": z.boolean(),
    "parentSoftware": zSoftwareRef.optional(),
    "isFromFrenchPublicService": z.boolean(),
    "isPresentInSupportContract": z.boolean(),
    "alikeSoftwares": z.array(zSoftwareRef),
    "wikidataId": z.string().optional(),
    "comptoirDuLibreId": z.number().optional(),
    "license": z.string(),
    "contextOfUse": z.string().optional(),
    "catalogNumeriqueGouvFrId": z.string().optional(),
    "mimGroup": z.union([
        z.literal("MIMO"),
        z.literal("MIMDEV"),
        z.literal("MIMPROD"),
        z.literal("MIMDEVOPS"),
    ]),
    "versionMin": z.string(),
    "workshopUrls": z.array(z.string()),
    "testUrls": z.array(
        z.object({
            "description": z.string(),
            "url": z.string(),
        }),
    ),
    "useCaseUrls": z.array(z.string()),
    "agentWorkstation": z.boolean(),
});

type Got = ReturnType<typeof zSoftwareRow["parse"]>;
type Expected = SoftwareRow;

assert<Equals<Got, Expected>>();

fs.writeFileSync(
    softwareFilePath,
    Buffer.from(
        JSON.stringify(
            JSON.parse(fs.readFileSync(softwareFilePath).toString("utf8")).map(
                (softwareRow: SoftwareRow) => {
                    try {
                        zSoftwareRow.parse(softwareRow);
                    } catch (exception) {
                        console.log(softwareRow);

                        throw exception;
                    }

                    const {
                        id,
                        name,
                        "function": fun,
                        referencedSinceTime,
                        dereferencing,
                        isStillInObservation,
                        parentSoftware,
                        isFromFrenchPublicService,
                        isPresentInSupportContract,
                        alikeSoftwares,
                        wikidataId,
                        comptoirDuLibreId,
                        license,
                        contextOfUse,
                        catalogNumeriqueGouvFrId,
                        mimGroup,
                        versionMin,
                        workshopUrls,
                        testUrls,
                        useCaseUrls,
                        agentWorkstation,
                        ...rest
                    } = softwareRow;

                    try {
                        assert(Object.keys(rest).length === 0);
                    } catch (error) {
                        console.log(rest);

                        throw error;
                    }

                    return {
                        id,
                        name,
                        "function": fun,
                        referencedSinceTime,
                        dereferencing,
                        isStillInObservation,
                        parentSoftware,
                        isFromFrenchPublicService,
                        isPresentInSupportContract,
                        alikeSoftwares,
                        wikidataId,
                        comptoirDuLibreId,
                        license,
                        contextOfUse,
                        catalogNumeriqueGouvFrId,
                        mimGroup,
                        versionMin,
                        workshopUrls,
                        testUrls,
                        useCaseUrls,
                        agentWorkstation,
                    };
                },
            ),
            null,
            2,
        ),
        "utf8",
    ),
);
