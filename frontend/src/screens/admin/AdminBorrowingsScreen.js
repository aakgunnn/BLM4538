import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Clock, RotateCcw, Filter } from 'lucide-react-native';
import apiService from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const AdminBorrowingsScreen = () => {
  const { token } = useAuth();
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active'); // active | returned | all

  const fetchBorrowings = useCallback(async () => {
    try {
      const data = await apiService.getAllBorrowings(token);
      setBorrowings(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchBorrowings(); }, [fetchBorrowings]);

  const filtered = filter === 'all' ? borrowings
    : borrowings.filter(b => filter === 'active' ? b.status === 'borrowed' : b.status === 'returned');

  const handleExtend = (id, title) => {
    Alert.alert('Süre Uzat', `"${title}"`, [
      { text: 'İptal', style: 'cancel' },
      { text: '7 Gün', onPress: () => doExtend(id, 7) },
      { text: '14 Gün', onPress: () => doExtend(id, 14) },
      { text: '30 Gün', onPress: () => doExtend(id, 30) },
    ]);
  };
  const doExtend = async (id, days) => {
    try {
      const r = await apiService.updateBorrowingDuration(id, days, token);
      Alert.alert('Başarılı ✅', r.message); fetchBorrowings();
    } catch (e) { Alert.alert('Hata', e.message); }
  };
  const handleForceReturn = (id, title) => {
    Alert.alert('Zorla İade', `"${title}" iade edilsin mi?`, [
      { text: 'İptal', style: 'cancel' },
      { text: 'İade Et', style: 'destructive', onPress: async () => {
        try { await apiService.forceReturnBook(id, token); fetchBorrowings(); }
        catch (e) { Alert.alert('Hata', e.message); }
      }},
    ]);
  };

  if (loading) return <View style={s.ctr}><ActivityIndicator size="large" color="#1E293B"/></View>;

  return (
    <View style={s.c}>
      <View style={s.hdr}>
        <Text style={s.ht}>Ödünç Yönetimi</Text>
        <Text style={s.hs}>{borrowings.filter(b=>b.status==='borrowed').length} aktif ödünç</Text>
      </View>

      {/* Filters */}
      <View style={s.filters}>
        {[{k:'active',l:'Aktif'},{k:'returned',l:'İade'},{k:'all',l:'Tümü'}].map(f=>(
          <TouchableOpacity key={f.k} style={[s.fBtn, filter===f.k&&s.fActive]} onPress={()=>setFilter(f.k)}>
            <Text style={[s.fText, filter===f.k&&s.fTextActive]}>{f.l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList data={filtered} keyExtractor={i=>i.id} contentContainerStyle={{paddingHorizontal:16,paddingBottom:30}}
        renderItem={({item})=>(
          <View style={s.card}>
            <View style={[s.dot,{backgroundColor:item.status==='borrowed'?'#F59E0B':'#10B981'}]}/>
            <View style={{flex:1}}>
              <Text style={s.ct} numberOfLines={1}>{item.title}</Text>
              <Text style={s.cu}>{item.user_name}</Text>
              <Text style={s.cd}>
                {new Date(item.borrow_date).toLocaleDateString('tr-TR')}
                {item.status==='returned' && ` → ${new Date(item.return_date).toLocaleDateString('tr-TR')}`}
              </Text>
            </View>
            {item.status === 'borrowed' && (
              <View style={{flexDirection:'row',gap:6}}>
                <TouchableOpacity style={s.extBtn} onPress={()=>handleExtend(item.id,item.title)}>
                  <Clock size={16} color="#F59E0B"/>
                </TouchableOpacity>
                <TouchableOpacity style={s.retBtn} onPress={()=>handleForceReturn(item.id,item.title)}>
                  <RotateCcw size={16} color="#EF4444"/>
                </TouchableOpacity>
              </View>
            )}
            {item.status === 'returned' && (
              <Text style={s.retBadge}>İade</Text>
            )}
          </View>
        )}
        ListEmptyComponent={<View style={{alignItems:'center',padding:48}}><Text style={{color:'#94A3B8'}}>Kayıt yok</Text></View>}
      />
    </View>
  );
};
const s = StyleSheet.create({
  c:{flex:1,backgroundColor:'#F1F5F9'},ctr:{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#F1F5F9'},
  hdr:{backgroundColor:'#1E293B',paddingHorizontal:24,paddingTop:48,paddingBottom:20},
  ht:{fontSize:24,fontWeight:'bold',color:'#FFF'},hs:{fontSize:13,color:'#94A3B8',marginTop:4},
  filters:{flexDirection:'row',paddingHorizontal:16,marginVertical:10,gap:8},
  fBtn:{flex:1,paddingVertical:10,alignItems:'center',borderRadius:8,backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#E2E8F0'},
  fActive:{backgroundColor:'#1E293B',borderColor:'#1E293B'},
  fText:{fontSize:13,fontWeight:'500',color:'#64748B'},fTextActive:{color:'#FFFFFF'},
  card:{flexDirection:'row',alignItems:'center',backgroundColor:'#FFF',borderRadius:10,padding:14,marginBottom:8,borderWidth:1,borderColor:'#E2E8F0'},
  dot:{width:8,height:8,borderRadius:4,marginRight:12},
  ct:{fontSize:15,fontWeight:'600',color:'#1E293B'},cu:{fontSize:13,color:'#64748B',marginTop:2},
  cd:{fontSize:11,color:'#94A3B8',marginTop:4},
  extBtn:{padding:10,backgroundColor:'rgba(245,158,11,0.1)',borderRadius:8},
  retBtn:{padding:10,backgroundColor:'rgba(239,68,68,0.1)',borderRadius:8},
  retBadge:{fontSize:12,fontWeight:'600',color:'#10B981',backgroundColor:'#F0FDF4',paddingHorizontal:10,paddingVertical:4,borderRadius:6},
});
export default AdminBorrowingsScreen;
