/**
 * @author Kaleb Murphy
 * Modified uvs.push on line no. 42.
 */
import * as THREE from 'three/build/three.module.js';

class XRingGeometry extends THREE.Geometry {
  constructor(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength) {
    super();

    this.type = 'XRingGeometry';

    this.parameters = {
      innerRadius: innerRadius,
      outerRadius: outerRadius,
      thetaSegments: thetaSegments,
      phiSegments: phiSegments,
      thetaStart: thetaStart,
      thetaLength: thetaLength
    };

    innerRadius = innerRadius || 0;
    outerRadius = outerRadius || 50;

    thetaStart = thetaStart !== undefined ? thetaStart : 0;
    thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;

    thetaSegments = thetaSegments !== undefined ? Math.max( 3, thetaSegments ) : 8;
    phiSegments = phiSegments !== undefined ? Math.max( 1, phiSegments ) : 8;

    var i, o, uvs = [], radius = innerRadius, radiusStep = ( ( outerRadius - innerRadius ) / phiSegments );

    for ( i = 0; i < phiSegments + 1; i ++ ) { // concentric circles inside ring

      for ( o = 0; o < thetaSegments + 1; o ++ ) { // number of segments per circle

        var vertex = new THREE.Vector3();
        var segment = thetaStart + o / thetaSegments * thetaLength;
        vertex.x = radius * Math.cos( segment );
        vertex.z = radius * Math.sin( segment );

        this.vertices.push( vertex );
        // uvs.push( new THREE.Vector2( ( vertex.x / outerRadius + 1 ) / 2, ( vertex.y / outerRadius + 1 ) / 2 ) );
        uvs.push( new THREE.Vector2( o / thetaSegments, i / phiSegments ) );
      }

      radius += radiusStep;

    }

    var n = new THREE.Vector3( 1, 0, 0 );

    for ( i = 0; i < phiSegments; i ++ ) { // concentric circles inside ring

      var thetaSegment = i * (thetaSegments + 1);

      for ( o = 0; o < thetaSegments ; o ++ ) { // number of segments per circle

        var segment = o + thetaSegment;

        var v1 = segment;
        var v2 = segment + thetaSegments + 1;
        var v3 = segment + thetaSegments + 2;

        this.faces.push( new THREE.Face3( v1, v2, v3, [ n.clone(), n.clone(), n.clone() ] ) );
        this.faceVertexUvs[ 0 ].push( [ uvs[ v1 ].clone(), uvs[ v2 ].clone(), uvs[ v3 ].clone() ]);

        v1 = segment;
        v2 = segment + thetaSegments + 2;
        v3 = segment + 1;

        this.faces.push( new THREE.Face3( v1, v2, v3, [ n.clone(), n.clone(), n.clone() ] ) );
        this.faceVertexUvs[ 0 ].push( [ uvs[ v1 ].clone(), uvs[ v2 ].clone(), uvs[ v3 ].clone() ]);

      }
    }

    this.computeFaceNormals();

    this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );
  }
}

export default XRingGeometry;
