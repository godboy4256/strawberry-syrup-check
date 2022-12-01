// import os from "os";
import cluster from "cluster";

import http from "node:http";
import { cpus } from "node:os";
import process from "node:process";

function psSleep() {
	return new Promise((resolve) => setTimeout(resolve, 300000));
}

async function restartPsForHa(restartClusterObj: any, pid: number) {
	try {
		console.log("PS:", pid, "wait for recreating...");
		await psSleep();
		restartClusterObj.fork();
	} catch (err) {
		console.log("[LIB: CLUSTER ERROR]: Error from Recreat Func\n", err);
	}
}

export function createServerAsCluster(startFuncPointer: any) {
	const numCPUs = cpus().length;

	if (cluster.isPrimary) {
		console.log(`Primary ${process.pid} is running`);

		// Fork workers.
		for (let i = 0; i < numCPUs; i++) {
			cluster.fork();
		}

		cluster.on("exit", (worker, code, signal) => {
			console.log(`worker ${worker.process.pid} died`);
		});
	} else {
		startFuncPointer();

		// console.log(`Worker ${process.pid} started`);
	}
}

// export function createServerAsCluster(startFuncPointer: any) {
// 	let isProcessMaster = false;
// 	const clusterCpuCount = os.cpus().length;
// 	// const clusterCpuCount = 2
// 	if (clusterCpuCount > 1) {
// 		if (cluster.isMaster) {
// 			const serverTime = new Date();
// 			console.log("Cluster INFO [total cpus: ", clusterCpuCount, "]");
// 			console.log("PS[master]: Created ", serverTime.toLocaleString());
// 			for (let cpu = 0; cpu < clusterCpuCount; cpu++) {
// 				cluster.fork();
// 			}

// 			cluster.on("fork", function (worker_) {
// 				console.log("PS[worker]: ", worker_.id, ' - "FORK" event ', serverTime.toLocaleString());
// 			});
// 			cluster.on("exit", function (worker_) {
// 				console.log("PS[worker]: ", worker_.id, ' - "EXIT" event ', serverTime.toLocaleString());
// 				restartPsForHa(cluster, worker_.id);
// 			});
// 			isProcessMaster = true;
// 		} else {
// 			startFuncPointer();
// 		}
// 	} else {
// 		startFuncPointer();
// 	}
// 	return isProcessMaster;
// }
